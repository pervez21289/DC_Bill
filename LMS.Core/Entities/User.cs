using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    public class  User
    {
        public long? UserId { get; set; }
        public string? FirstName { get; set; }
        public string? Password { get; set; } = "";
        public List<int>? RoleIDs { get; set; } = new();
        public string? Email { get; set; } = "";
        public string? Mobile { get; set; }
        public string? OTP{get; set; } = ""; 
        public string? PasswordHash {  get; set; }
        public int? CompanyID { get; set; }
        public string? RoleNames { get; set; }
        public string? RoleId { get; set; }
    }
    public class RegisterRequest
    {
        public string Company { get; set; }
        public string FirstName { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string? Password { get; set; }
    }

    public class UserLoginDto
    {
        public int UserID { get; set; }
        public string? FirstName { get; set; }
        public string? Mobile { get; set; }
        public string? Email { get; set; }
        public int CompanyID { get; set; }
        public string? CompanyName { get; set; }
        public string? RoleNames { get; set; }
        public string? menuItemDtos { get; set; }
        public string? SubscriptionJson { get; set; }
        public bool IsOTPVerified { get; set; }
        public string OTP { get; set; }
    }


    public class MenuItemDto
    {
        public int MenuID { get; set; }
        public int? ParentMenuID { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public string Type { get; set; }
        public string Icon { get; set; }
        public int SortOrder { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string Token { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public string? Token { get; set; }
        public DateTime Expiration { get; set; }
        public string? Email { get; set; }
        public string? Mobile { get; set; }
        public string? Menus { get; set; } // assuming MenuItemDto exists
        public string? Name { get; set; }
        public string? Role { get; set; }       // assuming multiple role names
        public string? Plan { get; set; }             // assuming SubscriptionJson is a string
        public bool Success { get; set; }
        public int UserID { get; set; }
        public bool IsOTPVerified { get; set; }
    }

}
