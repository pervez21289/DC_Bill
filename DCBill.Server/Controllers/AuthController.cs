// LMS.API/Controllers/AuthController.cs
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Core.Models;
using LMS.Repository.Repo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;        
        private readonly IEmailService _emailService;   

        public AuthController(IUserRepository userRepository, IConfiguration configuration, IEmailService emailService)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Invalid request",
                        Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
                    });
                }

                // Validate user credentials
                var (user, storedHash, isActive,isEmailVerified, message) = await _userRepository.ValidateUserForLoginAsync(request.EmailOrUsername);

                if (user == null || !isActive)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = message ?? "Invalid email/username or password"
                    });
                }

                if(!isEmailVerified)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Email not verified."
                    });
                }

                // Verify password
                if (!BCrypt.Net.BCrypt.Verify(request.Password, storedHash))
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Invalid email/username or password"
                    });
                }

                // Update last login
                await _userRepository.UpdateLastLoginAsync(user.Id, GetIpAddress());

                // Generate JWT token and Refresh Token
                var token = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();

                // Save refresh token to database
                await _userRepository.SaveRefreshTokenAsync(user.Id, refreshToken, DateTime.UtcNow.AddDays(7));

                var response = new LoginResponse
                {
                    Token = token,
                    RefreshToken = refreshToken,
                    User = new UserDto
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Email = user.Email,
                        FullName = user.FullName,
                        Company = user.Company,
                        Role = user.Role,
                        IsActive = user.IsActive,
                        LastLogin = user.LastLogin,
                        CreatedAt = user.CreatedAt
                    }
                };

                return Ok(new ApiResponse<LoginResponse>
                {
                    Success = true,
                    Message = "Login successful",
                    Data = response
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Login failed: {ex.Message}"
                });
            }
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Invalid request",
                        Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
                    });
                }

                // Check if email exists
                if (await _userRepository.EmailExistsAsync(request.Email))
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Email already registered"
                    });
                }

                // Check if username exists
                if (await _userRepository.UsernameExistsAsync(request.Username))
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Username already taken"
                    });
                }

                // Hash password
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
                var token = TokenHelper.GenerateToken();
                // Create user object
                var user = new AppUser
                {
                    Username = request.Username,
                    Email = request.Email,
                    FullName = request.FullName,
                    Company = request.Company,
                    Role = "User",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsEmailVerified = false,
                    EmailVerificationTokenHash = TokenHelper.Hash(token),
                    EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24)
                };

                // Register user
                (int userId, string message) = await _userRepository.RegisterUserAsync(user, passwordHash);

                if (userId <= 0)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = message ?? "Registration failed"
                    });
                }



                await _emailService.SendVerificationEmailAsync(user.Email, user.FullName, token);

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Registration successful. Please login.",
                    Data = new { UserId = userId }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Registration failed: {ex.Message}"
                });
            }
        }

        [AllowAnonymous]
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest request)
        {
            var result = await _userRepository.VerifyEmailAsync(request.Email, request.Token);

            return result.Success
                ? Ok(result)
                : BadRequest(result);
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.RefreshToken))
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Refresh token is required"
                    });
                }

                // Validate refresh token from database
                var refreshTokenData = await _userRepository.GetRefreshTokenAsync(request.RefreshToken);

                if (refreshTokenData == null)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Invalid refresh token"
                    });
                }

                if (refreshTokenData.ExpiryDate < DateTime.UtcNow)
                {
                    // Token expired, remove it from database
                    await _userRepository.RemoveRefreshTokenAsync(request.RefreshToken);
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Refresh token has expired. Please login again."
                    });
                }

                if (refreshTokenData.IsRevoked)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Refresh token has been revoked"
                    });
                }

                // Get user details
                var user = await _userRepository.GetByIdAsync(refreshTokenData.UserId);
                if (user == null)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                if (!user.IsActive)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Account is deactivated"
                    });
                }

                // Generate new tokens
                var newToken = GenerateJwtToken(user);
                var newRefreshToken = GenerateRefreshToken();

                // Update refresh token in database
                await _userRepository.UpdateRefreshTokenAsync(request.RefreshToken, newRefreshToken, DateTime.UtcNow.AddDays(7));

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Token refreshed successfully",
                    Data = new
                    {
                        Token = newToken,
                        RefreshToken = newRefreshToken
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Failed to refresh token: {ex.Message}"
                });
            }
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
        {
            try
            {
                if (!string.IsNullOrEmpty(request.RefreshToken))
                {
                    await _userRepository.RemoveRefreshTokenAsync(request.RefreshToken);
                }

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Logged out successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Logout failed: {ex.Message}"
                });
            }
        }

        [Authorize]
        [HttpPost("revoke-all-tokens")]
        public async Task<IActionResult> RevokeAllTokens()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "User not authenticated"
                    });
                }

                await _userRepository.RevokeAllRefreshTokensAsync(userId.Value);

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "All refresh tokens revoked successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Failed to revoke tokens: {ex.Message}"
                });
            }
        }

        // Private helper methods
        private string GenerateJwtToken(AppUser user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Secret"] ?? "your-default-secret-key-at-least-32-chars-long");

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.GivenName, user.FullName),
                new Claim(ClaimTypes.Role, user.Role ?? "User"),
                new Claim("CompanyId", user.CompanyId.ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["JwtSettings:AccessTokenExpirationMinutes"] ?? "15")),
                Issuer = _configuration["JwtSettings:Issuer"] ?? "LMS_API",
                Audience = _configuration["JwtSettings:Audience"] ?? "LMS_Client",
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return null;

            return int.Parse(userIdClaim);
        }

        private string GetIpAddress()
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            if (string.IsNullOrEmpty(ipAddress))
                ipAddress = "Unknown";

            return ipAddress;
        }
    }
}