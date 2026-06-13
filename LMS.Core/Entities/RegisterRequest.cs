using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
  
    

    

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

   
}
