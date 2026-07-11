using System;
using System.Collections.Generic;

namespace LMS.Core.Entities
{
    /// <summary>
    /// Maps to sp_GetGSTReport Result Set 1: Invoice-wise GST Details
    /// </summary>
    public class GSTReportDto
    {
        public int InvoiceId { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string InvoiceType { get; set; } // B2B, B2C, Export, etc.
        public string PartyName { get; set; }
        public string PartyGstin { get; set; }
        public string PartyStateCode { get; set; }
        public string PartyState { get; set; }
        public decimal TaxableAmount { get; set; }
        public decimal CGSTAmount { get; set; }
        public decimal SGSTAmount { get; set; }
        public decimal IGSTAmount { get; set; }
        public decimal TotalGST { get; set; }
        public decimal TotalAmount { get; set; }
        public int PaymentStatus { get; set; }
        public string PlaceOfSupply { get; set; }
        public bool ReverseCharge { get; set; }
        public string EInvoiceStatus { get; set; }
        public string IRN { get; set; }
        public string AckNo { get; set; }
        public DateTime? AckDate { get; set; }
    }

    /// <summary>
    /// Maps to sp_GetGSTReport Result Set 2: GST Summary (Totals)
    /// </summary>
    public class GSTSummaryDto
    {
        public int TotalInvoices { get; set; }
        public decimal TotalTaxableAmount { get; set; }
        public decimal TotalCGST { get; set; }
        public decimal TotalSGST { get; set; }
        public decimal TotalIGST { get; set; }
        public decimal TotalGST { get; set; }
        public decimal GrandTotal { get; set; }
        public int PaidInvoices { get; set; }
        public int PartialInvoices { get; set; }
        public int UnpaidInvoices { get; set; }
        public List<HSNWiseSummaryDto> HSNWiseSummary { get; set; } = new List<HSNWiseSummaryDto>();
        public List<PartyWiseGSTSummaryDto> PartyWiseSummary { get; set; } = new List<PartyWiseGSTSummaryDto>();
    }

    /// <summary>
    /// Maps to sp_GetGSTReport Result Set 3: HSN-wise Summary
    /// </summary>
    public class HSNWiseSummaryDto
    {
        public string HSNCode { get; set; }
        public string Description { get; set; }
        public decimal TaxableAmount { get; set; }
        public decimal CGSTAmount { get; set; }
        public decimal SGSTAmount { get; set; }
        public decimal IGSTAmount { get; set; }
        public decimal TotalGST { get; set; }
        public decimal TotalQuantity { get; set; }
        public decimal AverageRate { get; set; }
        public int InvoiceCount { get; set; }
    }

    /// <summary>
    /// Maps to sp_GetGSTReport Result Set 4: Party-wise GST Summary
    /// </summary>
    public class PartyWiseGSTSummaryDto
    {
        public int PartyId { get; set; }
        public string PartyName { get; set; }
        public string PartyGstin { get; set; }
        public string PartyStateCode { get; set; }
        public string PartyState { get; set; }
        public int InvoiceCount { get; set; }
        public decimal TaxableAmount { get; set; }
        public decimal CGSTAmount { get; set; }
        public decimal SGSTAmount { get; set; }
        public decimal IGSTAmount { get; set; }
        public decimal TotalGST { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal PartialAmount { get; set; }
        public decimal UnpaidAmount { get; set; }
    }

    public class GSTReportResponseDto
    {
        public List<GSTReportDto> Invoices { get; set; } = new List<GSTReportDto>();
        public GSTSummaryDto Summary { get; set; } = new GSTSummaryDto();
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string CompanyName { get; set; }
        public string CompanyGSTIN { get; set; }
        public string CompanyState { get; set; }
        public string CompanyStateCode { get; set; }
        public string CompanyAddress { get; set; }
        public string CompanyPAN { get; set; }
        public string CompanyEmail { get; set; }
        public string CompanyPhone { get; set; }
    }
}