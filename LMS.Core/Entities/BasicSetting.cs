using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    public class BasicSetting
    {
        public int Id { get; set; }
        public string StoreName { get; set; }
        public string Address { get; set; }
        public string ContactEmail { get; set; }
        public string GSTIN { get; set; }
        public int? CompanyID { get; set; } 
        public decimal? GST { get; set; }
    }

    public class BillingSettings
    {
        public int Id { get; set; }

        public string CompanyName { get; set; } = string.Empty;

        public string GSTIN { get; set; } = string.Empty;

        public string? MobileNumber { get; set; }

        public string? Address { get; set; }

        public string? City { get; set; }

        public string? PinCode { get; set; }

        public string? State { get; set; }

        public string? Country { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }

}
