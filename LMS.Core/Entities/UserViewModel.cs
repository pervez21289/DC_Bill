using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    public class  UserViewModel
    {
        public long UserId { get; set; }
        public string? Name { get; set; }
        public string? UserName { get; set; }
        public string RoleName { get; set; } = "";
        public int?   RoleId { get; set; }
        public string Email { get; set; } = "";
        public string? Mobile { get; set; }
        public string? city_name { get; set; }
        public string? ZipCode { get; set; }
        public string? ImagePath { get; set; }
        public string? CityId { get; set; }

    }

    public class Messages
    {
        public long UserId { get; set;}
        public string Message { get; set;}
        public long SentTo { get; set; }
    }

    public class VerifyEmailRequest
    {
        [Required, EmailAddress, MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required, MaxLength(200)]
        public string Token { get; set; } = string.Empty;
    }

    public class VerifyEmailResult
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
