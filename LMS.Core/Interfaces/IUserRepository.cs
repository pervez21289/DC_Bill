// LMS.Core/Interfaces/IUserRepository.cs
using LMS.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LMS.Core.Interfaces
{
    public interface IUserRepository
    {
        // Basic CRUD operations
        Task<IEnumerable<AppUser>> GetAsync();
        Task<AppUser> GetByIdAsync(int id);
        Task<AppUser> GetByEmailAsync(string email);
        Task<AppUser> GetByUsernameAsync(string username);
        Task<int> CreateAsync(AppUser model);
        Task<int> UpdateAsync(AppUser model);
        Task<int> DeleteAsync(int id);

        // Authentication specific
        Task<int> ChangePasswordAsync(int userId, string passwordHash);
        Task<int> UpdateLastLoginAsync(int userId, string ipAddress);
        Task<bool> EmailExistsAsync(string email, int? excludeUserId = null);
        Task<bool> UsernameExistsAsync(string username, int? excludeUserId = null);
        Task<(int UserId, string Message)> RegisterUserAsync(AppUser user, string passwordHash);
        Task<(AppUser User, string PasswordHash, bool IsActive, string Message)> ValidateUserForLoginAsync(string emailOrUsername);

        // Search and filtering
        Task<IEnumerable<AppUser>> SearchAsync(string keyword);
        Task<IEnumerable<AppUser>> GetActiveUsersAsync();
        Task<int> GetUserCountAsync(bool? isActive = null);
        Task<int> UpdateUserStatusAsync(int userId, bool isActive);
        Task<AppUser> GetUserWithDetailsAsync(int id);


        // Refresh Token methods
        Task SaveRefreshTokenAsync(int userId, string refreshToken, DateTime expiryDate);
        Task<RefreshToken> GetRefreshTokenAsync(string refreshToken);
        Task UpdateRefreshTokenAsync(string oldRefreshToken, string newRefreshToken, DateTime expiryDate);
        Task RemoveRefreshTokenAsync(string refreshToken);
        Task RevokeAllRefreshTokensAsync(int userId);
    }
}