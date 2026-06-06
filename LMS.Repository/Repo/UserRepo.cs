using Amazon.Runtime.Internal.Endpoints.StandardLibrary;
using Azure.Core;
using Dapper;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Drawing.Imaging;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Reflection;
using System.Reflection.Metadata;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Repo.Repository
{
    public class UserRepo : BaseRepository, IUser
    {
        public readonly AppSettings _appSettings;
        private readonly IBackgroundJobQueue _jobQueue;
        public UserRepo(AppSettings appSettings, IBackgroundJobQueue jobQueue   )
        {
            _appSettings = appSettings;
            _jobQueue = jobQueue;
        }

        public async Task<int> CreateUserAsync(User user)
        {
            if(!string.IsNullOrEmpty(user.PasswordHash))
            {
                       user.PasswordHash = ComputeSha256Hash(user.PasswordHash);    
            }
            else
            {
                user.PasswordHash = null;
            }

            var p = new DynamicParameters();
            p.Add("@FirstName", user.FirstName);
            p.Add("@Mobile", user.Mobile);
            p.Add("@Email", user.Email);
            p.Add("@PasswordHash", user.PasswordHash);
            p.Add("@CompanyID", user.CompanyID);
            p.Add("@UserId", user.UserId);
            // RoleIDs as Table-Valued Parameter
            var table = new DataTable();
            table.Columns.Add("RoleID", typeof(int));
            foreach (var id in user.RoleIDs)
            {
                table.Rows.Add(id);
            }
            p.Add("@Roles", table.AsTableValuedParameter("dbo.RoleIDTableType"));

            return await ExecuteScalarAsync<int>("CreateUserWithRole", p, commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteUserAsync(int userId)
        {
            await ExecuteAsync("DeleteUser", new { UserID = userId }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<User>> GetUsersAsync(int CompanyID)
        {
            return await QueryAsync<User>("GetUsersWithRoles", new { CompanyID=CompanyID},commandType: CommandType.StoredProcedure);
        }



        public async Task<CreateUserResult> RegisterCompanyWithAdminAsync(RegisterRequest request)
        {
            try
            {
                var passwordHash = ComputeSha256Hash(request.Password);

                CreateUserResult result = await QueryFirstOrDefaultAsync<CreateUserResult>(
                    "CreateCompanyWithAdmin",
                    new
                    {
                        CompanyName = request.Company,
                        FirstName = request.FirstName,
                        Mobile = request.Mobile,
                        Email = request.Email,
                        PasswordHash = passwordHash // Example
                    },
                    commandType: CommandType.StoredProcedure
                );

                if (result.Success)
                {
                    
                    await _jobQueue.EnqueueAsync(new BackgroundJob
                    {
                        JobType = BackgroundJobType.SendEmail,
                        Payload = (request.Email,request.FirstName, result.OTP)
                    });

                    await _jobQueue.EnqueueAsync(new BackgroundJob
                    {
                        JobType = BackgroundJobType.SentOTPMobile,
                        Payload = ( request.Mobile, result.OTP)
                    });
                }
                //Task taskSMS = SendSMS(result.OTP, request.Mobile);
                
            

                return result;
            }
            catch
            {
                throw;
            }
        }

        public async Task<LoginResponse?> LoginAsync(string email, string password)
        {
            var passwordHash = ComputeSha256Hash(password);
            LoginResponse? loginResponse = null;

            var (userDto, menuItems) = await QueryMultipleStringAsync<UserLoginDto, string>("UserLogin", new { Email = email, Password = passwordHash }, commandType: CommandType.StoredProcedure);

            if (userDto != null)
            {
                loginResponse = await GetUserLoginDto(userDto);
                loginResponse.Menus = menuItems;
            }
           
            return loginResponse;

        }

        public async Task<LoginResponse?> ValidateOTP(User user)
        {
            try
            {
                //bool IsValid= await QueryFirstOrDefaultAsync<bool>("SP_ValidateOTP", new { UserId = user.UserId, OTP = user.OTP });
                //return IsValid;
                LoginResponse? loginResponse = null;
                var (userDto, menuItems) = await QueryMultipleStringAsync<UserLoginDto, string>("SP_ValidateOTP", new { UserId = user.UserId, OTP = user.OTP });

                if (userDto != null)
                {
                    loginResponse = await GetUserLoginDto(userDto);
                    loginResponse.Menus = menuItems;
                }

                return loginResponse;

            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Result> SendResetPasswordEmail(string email,string resetToken)
        {
            // Load the HTML template
            var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", "ResetPasswordTemplate.html");
            string htmlContent = await File.ReadAllTextAsync(templatePath);
            var resetLink = $"{_appSettings.RedirectUrl}/reset-password?token={resetToken}";
            // Replace placeholders
            htmlContent = htmlContent.Replace("{{resetLink}}", resetLink)
                                     .Replace("{{year}}", DateTime.Now.Year.ToString());

            using (var message = new MailMessage())
            {
                message.From = new MailAddress(_appSettings.Email);
                message.To.Add(email); // TODO: Use user's email
                message.Subject = "Reset Your Password - NexBillPOS";
                message.IsBodyHtml = true;
                message.Body = htmlContent;
            

                using (var smtp = new SmtpClient("smtp.gmail.com", 587))
                {
                    smtp.Credentials = new NetworkCredential(_appSettings.Email, _appSettings.Secret);
                    smtp.EnableSsl = true;

                    await smtp.SendMailAsync(message);
                }

                return new Result() { IsSuccess = true, Message = "Password reset link sent successfully" };
            }
        }

        public async Task<Result> SentForgotEmail(string resetToken)
        {
            try
            {
                var resetLink = $"{_appSettings.RedirectUrl}/reset-password?token={resetToken}";
                MailMessage message = new MailMessage();
                message.From = new MailAddress(_appSettings.Email);
                message.To.Add("pervez21289@gmail.com"); // TODO: Use user's email
                message.Subject = "Password Reset Request";
                message.IsBodyHtml = true;
                message.Body = $"<div>Click <a href='{resetLink}'>here</a> to reset your password.</div>";

                SmtpClient client = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential(_appSettings.Email, _appSettings.Secret),
                    EnableSsl = true
                };

                await client.SendMailAsync(message);

                return new Result() { IsSuccess = true, Message = "Password reset link sent successfully" };
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Result> SentEmail(string email,string OTP)
        {
            try
            {
                MailMessage message = new MailMessage();
                message.From = new MailAddress("aliusman9760@gmail.com");
                message.To.Add(email);
                message.Subject = "OTP Verification #";
                message.IsBodyHtml = true;
                message.Body = "<div>" + OTP + "</div>";

                SmtpClient client = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential(_appSettings.Email, _appSettings.Secret),
                    EnableSsl = true
                };


                await client.SendMailAsync(message);


                return new Result() { IsSuccess = true, Message = "Email sent successfully" };
            }
            catch (Exception)
            {
                throw;
            }
        }



        public async Task<IEnumerable<ApiLog>> GetApiLogsAsync(int CompanyId,string search, DateTime? startDate, DateTime? endDate)
        {
            IEnumerable<ApiLog> logs = await QueryAsync<ApiLog>(
                "sp_GetApiLogs",
                new { CompanyID= CompanyId, Search = search, StartDate = startDate, EndDate = endDate },
                commandType: CommandType.StoredProcedure
            );

            return logs;
        }

        public async Task<bool> ForgotPasswordAsync(string email)
        {
            try
            {
                // Generate a reset token
                var resetToken = Guid.NewGuid().ToString();

                // Save the token in the database (you can create a new table or column for this purpose)
                await ExecuteAsync("UpdateUserResetToken", new { Email = email, ResetToken = resetToken }, commandType: CommandType.StoredProcedure);

                // Send the reset token via email
                //var emailResult = await SendResetPasswordEmail(email,resetToken);

                await _jobQueue.EnqueueAsync(new BackgroundJob
                {
                    JobType = BackgroundJobType.SendResetPasswordEmail,
                    Payload = (email, resetToken)
                });

                return true;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> ResetPasswordAsync(string token, string newPassword)
        {
            try
            {
                // Hash the new password
                var passwordHash = ComputeSha256Hash(newPassword);

                // Update the password in the database
                await ExecuteAsync("ResetUserPassword", new { ResetToken = token, PasswordHash = passwordHash }, commandType: CommandType.StoredProcedure);

                return true;
            }
            catch (Exception)
            {
                throw;
            }
        }

        private string ComputeSha256Hash(string rawData)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(rawData));

            var builder = new StringBuilder();
            foreach (var b in bytes)
                builder.Append(b.ToString("x2"));

            return builder.ToString();
        }

        private JwtSecurityToken GetToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.TSecret));

            var token = new JwtSecurityToken(
                issuer: _appSettings.ValidIssuer,
                audience: _appSettings.ValidAudience,
                expires: DateTime.Now.AddYears(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }

        public async Task<LoginResponse> GetUserLoginDto(UserLoginDto userData)
        {
            if (userData != null)
            {
                if (userData.IsOTPVerified)
                {
                    var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, Convert.ToString(userData.UserID)),
                        new Claim(ClaimTypes.Role, Convert.ToString(userData.RoleNames)),
                        new Claim(ClaimTypes.NameIdentifier, Convert.ToString(userData.CompanyID)),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    };

                    authClaims.Add(new Claim(ClaimTypes.Role, userData.RoleNames));
                    var token = GetToken(authClaims);
                    return new LoginResponse()
                    {
                        Token = new JwtSecurityTokenHandler().WriteToken(token),
                        Expiration = token.ValidTo,
                        Email = userData?.Email,
                        Mobile = userData?.Mobile,
                        Name = userData?.FirstName,
                        Role = userData?.RoleNames,
                        Plan = userData?.SubscriptionJson,
                        Success = true,
                        UserID = userData.UserID,
                        IsOTPVerified = userData.IsOTPVerified
                    };
                }
                else
                {

                    await _jobQueue.EnqueueAsync(new BackgroundJob
                    {
                        JobType = BackgroundJobType.SendEmail,
                        Payload = (userData.Email, userData.OTP)
                    });

                    await _jobQueue.EnqueueAsync(new BackgroundJob
                    {
                        JobType = BackgroundJobType.SentOTPMobile,
                        Payload = (userData.Mobile, userData.OTP)
                    });

                    return new LoginResponse()
                    {
                        Success = true,
                        UserID = userData.UserID,
                        IsOTPVerified = userData.IsOTPVerified
                    };
                }
            }
            else
            {
                return new LoginResponse()
                {
                    Success = false,
                    UserID = 0,
                    IsOTPVerified = false
                };
            }


        }
    }

   
}
