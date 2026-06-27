using System;
using System.Collections.Generic;
using System.Text;

namespace LMS.Core.Entities
{
  
        public class DashboardStatsDto
        {
            public decimal TotalRevenue { get; set; }
            public int TotalInvoices { get; set; }
            public decimal AvgInvoiceValue { get; set; }
            public decimal TotalGSTCollected { get; set; }
            public int UniqueCustomers { get; set; }
            public int PaidInvoices { get; set; }
            public int PendingInvoices { get; set; }
        }

        public class RevenueTrendDto
        {
            public string Period { get; set; }
            public string PeriodLabel { get; set; }
            public decimal Revenue { get; set; }
            public int InvoiceCount { get; set; }
            public decimal GSTCollected { get; set; }
        }

        public class TopProductDto
        {
            public string ProductName { get; set; }
            public long TotalQuantity { get; set; }
            public decimal TotalRevenue { get; set; }
            public int InvoiceCount { get; set; }
            public decimal AvgPrice { get; set; }
        }

        public class RecentInvoiceDto
        {
            public int Id { get; set; }
            public string InvoiceNo { get; set; }
            public string PartyName { get; set; }
            public string PartyGSTIN { get; set; }
            public DateTime InvoiceDate { get; set; }
            public decimal GrandTotal { get; set; }
            public decimal TotalGST { get; set; }
            public string Status { get; set; }
            public int ItemCount { get; set; }
        }

        public class DateRangeDto
        {
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }
        }

        public class ReportListDto
        {
            public DashboardStatsDto Stats { get; set; }
            public DateRangeDto DateRange { get; set; }
        }

    public class InvoiceItem
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public int? ProductId { get; set; }
        public string ItemName { get; set; }
        public string HsnCode { get; set; }
        public int Quantity { get; set; }
        public decimal Rate { get; set; }
        public decimal Amount { get; set; }
        public decimal Discount { get; set; }
        public decimal Tax { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class InvoiceDto
    {
        public int Id { get; set; }
        public string InvoiceNo { get; set; }
        public int CompanyId { get; set; }
        public int? UserId { get; set; }
        public int? PartyId { get; set; }
        public string PartyName { get; set; }
        public string PartyAddress { get; set; }
        public string PartyCity { get; set; }
        public string PartyPinCode { get; set; }
        public string PartyState { get; set; }
        public string PartyGSTIN { get; set; }
        public DateTime InvoiceDate { get; set; }
        public decimal Subtotal { get; set; }
        public decimal TotalGST { get; set; }
        public decimal TotalAmount { get; set; }
        public int GstPercent { get; set; }
        public string Status { get; set; } // Paid, Pending, Cancelled
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsDeleted { get; set; }
        public long TotalCount { get; set; } // For pagination
    }

}
