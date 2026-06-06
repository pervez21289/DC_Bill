using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    public class SubscriptionPlan
    {
        public int SubscriptionId { get; set; }
        public int CustomerId { get; set; }
        public string PlanName { get; set; }
        public string PlanType { get; set; }
        public decimal AmountPaid { get; set; }
        public string Currency { get; set; }
        public string RazorpayOrderId { get; set; }
        public string RazorpayPaymentId { get; set; }
        public string PaymentStatus { get; set; }
        public DateTime PlanStartDate { get; set; }
        public DateTime PlanEndDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? PlanStatus { get; set; }
        public string? CompanyName { get; set; }
        public string? Email { get; set; }

    }


}
