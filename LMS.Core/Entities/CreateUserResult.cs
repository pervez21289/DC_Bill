using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    public class CreateUserResult
    {
        public bool Success { get; set; }        
        public string Message { get; set; }      
        public int? UserID { get; set; }  
        public string? OTP { get; set; } 
    }
}
