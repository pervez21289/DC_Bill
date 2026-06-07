using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    // Models/CreateInvoiceRequest.cs
 
        public class CreateInvoiceRequest
        {
            public string InvoiceNo { get; set; }
            public DateTime InvoiceDate { get; set; }
            public long PartyId { get; set; }
            public string PartyName { get; set; }
            public string PartyAddress { get; set; }
            public string PartyCity { get; set; }
            public string PartyState { get; set; }
            public string PartyPinCode { get; set; }
            public string PartyGSTIN { get; set; }
            public decimal Subtotal { get; set; }
            public decimal TotalGST { get; set; }
            public decimal GrandTotal { get; set; }
            public string Notes { get; set; }
            public List<CreateInvoiceDetailRequest> Details { get; set; }
        }

        public class CreateInvoiceDetailRequest
        {
            public long ItemId { get; set; }
            public string ItemName { get; set; }
            public string HsnCode { get; set; }
            public decimal Quantity { get; set; }
            public decimal Rate { get; set; }
            public decimal Amount { get; set; }
            public int GSTPercent { get; set; }
            public decimal GSTAmount { get; set; }
        }

        public class UpdateInvoiceRequest
        {
            public long Id { get; set; }
            public string InvoiceNo { get; set; }
            public DateTime InvoiceDate { get; set; }
            public long PartyId { get; set; }
            public string PartyName { get; set; }
            public string PartyAddress { get; set; }
            public string PartyCity { get; set; }
            public string PartyState { get; set; }
            public string PartyPinCode { get; set; }
            public string PartyGSTIN { get; set; }
            public decimal Subtotal { get; set; }
            public decimal TotalGST { get; set; }
            public decimal GrandTotal { get; set; }
            public string Notes { get; set; }
        }

        public class InvoiceMaster
        {
            public long Id { get; set; }
            public string InvoiceNo { get; set; }
            public DateTime InvoiceDate { get; set; }
            public long PartyId { get; set; }
            public string PartyName { get; set; }
            public string PartyAddress { get; set; }
            public string PartyCity { get; set; }
            public string PartyState { get; set; }
            public string PartyPinCode { get; set; }
            public string PartyGSTIN { get; set; }
            public decimal Subtotal { get; set; }
            public decimal TotalGST { get; set; }
            public decimal GrandTotal { get; set; }
            public string Notes { get; set; }
            public DateTime CreatedDate { get; set; }
            public DateTime? UpdatedDate { get; set; }
            public List<InvoiceDetail> Details { get; set; }
        }

        public class InvoiceDetail
        {
            public long Id { get; set; }
            public long InvoiceId { get; set; }
            public long ItemId { get; set; }
            public string ItemName { get; set; }
            public string HsnCode { get; set; }
            public decimal Quantity { get; set; }
            public decimal Rate { get; set; }
            public decimal Amount { get; set; }
            public int GSTPercent { get; set; }
            public decimal GSTAmount { get; set; }
            public DateTime CreatedDate { get; set; }
        }
    
}
