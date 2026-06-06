using System;
using System.Collections.Generic;
using System.Text;

namespace LMS.Core.Entities
{
    public class Result
    {
        public string Message { get; set; }
        public bool IsSuccess{get;set;}
        public long? Id { get; set; }
    }

    public class UserResult:Result { 
            public string OTP { get; set; }
    }

}
