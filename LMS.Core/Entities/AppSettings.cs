using System;
using System.Collections.Generic;
using System.Text;

namespace LMS.Core.Entities
{
    public class AppSettings
    {
       // public string Value { get; set; }
        public string Email { get; set; }
        public string Secret { get; set; }

        public string ValidAudience { get; set; }
        public string ValidIssuer { get; set; }
        public string TSecret { get; set; }
        public string RedirectUrl { get; set; }
        public string NexBill { get; set; }
    }
}
