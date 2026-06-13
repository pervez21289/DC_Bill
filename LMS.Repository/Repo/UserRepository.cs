// LMS.API/Repositories/UserRepository.cs
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LMS.API.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public async Task<IEnumerable<AppUser>> GetAsync()
        {
            var sql = "USP_GetUsers";
            return await QueryAsync<AppUser>(sql, null, CommandType.StoredProcedure);
        }

        public async Task<AppUser> GetByIdAsync(int id)
        {
            var parameters = new { Id = id };
            var sql = "USP_GetUserById";
            return await QueryFirstOrDefaultAsync<AppUser>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<AppUser> GetByEmailAsync(string email)
        {
            var parameters = new { Email = email };
            var sql = "USP_GetUserByEmail";
            return await QueryFirstOrDefaultAsync<AppUser>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<AppUser> GetByUsernameAsync(string username)
        {
            var parameters = new { Username = username };
            var sql = "USP_GetUserByUsername";
            return await QueryFirstOrDefaultAsync<AppUser>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<int> CreateAsync(AppUser model)
        {
            var parameters = new
            {
                model.Username,
                model.Email,
                model.PasswordHash,
                model.FullName,
                model.Company,
                model.Role
            };

            var sql = "USP_CreateUser";
            return await ExecuteScalarAsync<int>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<int> UpdateAsync(AppUser model)
        {
            var parameters = new
            {
                model.Id,
                model.Username,
                model.Email,
                model.FullName,
                model.Company,
                model.Role,
                model.IsActive
            };

            var sql = "USP_UpdateUser";
            return await ExecuteScalarAsync<int>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<int> DeleteAsync(int id)
        {
            var parameters = new { Id = id };
            var sql = "USP_DeleteUser";
            return await ExecuteScalarAsync<int>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<int> ChangePasswordAsync(int userId, string passwordHash)
        {
            var parameters = new
            {
                UserId = userId,
                PasswordHash = passwordHash
            };

            var sql = "USP_ChangeUserPassword";
            return await ExecuteScalarAsync<int>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<int> UpdateLastLoginAsync(int userId, string ipAddress)
        {
            var parameters = new
            {
                UserId = userId,
                IpAddress = ipAddress
            };

            var sql = "USP_UpdateUserLastLogin";
            return await ExecuteScalarAsync<int>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<bool> EmailExistsAsync(string email, int? excludeUserId = null)
        {
            var parameters = new
            {
                Email = email,
                ExcludeUserId = excludeUserId
            };
            var sql = "USP_CheckEmailExists";
            var result = await QueryFirstOrDefaultAsync<int>(sql, parameters, CommandType.StoredProcedure);
            return result > 0;
        }

        public async Task<bool> UsernameExistsAsync(string username, int? excludeUserId = null)
        {
            var parameters = new
            {
                Username = username,
                ExcludeUserId = excludeUserId
            };
            var sql = "USP_CheckUsernameExists";
            var result = await QueryFirstOrDefaultAsync<int>(sql, parameters, CommandType.StoredProcedure);
            return result > 0;
        }

        public async Task<(int UserId, string Message)> RegisterUserAsync(AppUser user, string passwordHash)
        {
            var parameters = new
            {
                user.Username,
                user.Email,
                PasswordHash = passwordHash,
                user.FullName,
                user.Company,
                user.Role
            };

            var sql = "USP_RegisterUser";
            var result = await QueryFirstOrDefaultAsync<dynamic>(sql, parameters, CommandType.StoredProcedure);

            if (result != null)
            {
                return (result.UserId, result.Message);
            }

            return (0, "Registration failed");
        }

        public async Task<(AppUser User, string PasswordHash, bool IsActive, string Message)> ValidateUserForLoginAsync(string emailOrUsername)
        {
            var parameters = new { EmailOrUsername = emailOrUsername };
            var sql = "USP_ValidateUserLogin";
            var result = await QueryFirstOrDefaultAsync<dynamic>(sql, parameters, CommandType.StoredProcedure);

            if (result == null || result.UserId == null)
            {
                return (null, null, false, "User not found");
            }

            var user = new AppUser
            {
                Id = result.UserId,
                Username = result.Username,
                Email = result.Email,
                FullName = result.FullName,
                Company = result.Company,
                Role = result.Role,
                IsActive = result.IsActive
            };

            return (user, result.PasswordHash, result.IsActive, result.Message);
        }

        public async Task<IEnumerable<AppUser>> SearchAsync(string keyword)
        {
            var parameters = new { Keyword = keyword };
            var sql = "USP_SearchUsers";
            return await QueryAsync<AppUser>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<AppUser>> GetActiveUsersAsync()
        {
            var sql = "USP_GetActiveUsers";
            return await QueryAsync<AppUser>(sql, null, CommandType.StoredProcedure);
        }

        public async Task<int> GetUserCountAsync(bool? isActive = null)
        {
            var parameters = new { IsActive = isActive };
            var sql = "USP_GetUserCount";
            return await QueryFirstOrDefaultAsync<int>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<int> UpdateUserStatusAsync(int userId, bool isActive)
        {
            var parameters = new
            {
                UserId = userId,
                IsActive = isActive
            };
            var sql = "USP_UpdateUserStatus";
            return await ExecuteScalarAsync<int>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<AppUser> GetUserWithDetailsAsync(int id)
        {
            var parameters = new { Id = id };
            var sql = "USP_GetUserWithDetails";
            return await QueryFirstOrDefaultAsync<AppUser>(sql, parameters, CommandType.StoredProcedure);
        }
    }
}