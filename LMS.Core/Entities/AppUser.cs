// LMS.Core/Entities/User.cs
using System;

namespace LMS.Core.Entities
{
    public class AppUser
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Company { get; set; }
        public string Role { get; set; } = "User";
        public bool IsActive { get; set; } = true;
        public DateTime? LastLogin { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int CompanyId { get; set; }
    }

    public class RefreshToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Token { get; set; }
        public DateTime ExpiryDate { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedByIp { get; set; }
        public DateTime? RevokedAt { get; set; }
        public string RevokedByIp { get; set; }

        // Navigation property
        public AppUser User { get; set; }
    }
}