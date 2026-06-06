using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    public class SaleItemDto
    {
        public int ProductID { get; set; }
        public string? ProductName { get; set; }
        public string? Barcode { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal CostPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal Tax { get; set; }
    }

   

    public class SaleDto
    {
        public string BillNo { get; set; }
        public int UserID { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal? TaxAmount { get; set; }
        public int PaymentStatus { get; set; }
        public string? Notes { get; set; }
        public string CustomerName { get; set; }
        public string MobileNumber { get; set; }
        public string PaymentModeID { get; set; }
        public int? CompanyID { get; set; }
        public List<SaleItemDto> saleItems { get; set; }
    }

    public class Sale
    {
        public int SaleID { get; set; }
        public string  BilledBy { get; set; }
        public string SaleTime { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal NetAmount { get; set; }
        public string PaymentStatus { get; set; }
        public string Notes { get; set; }
        public string P_Status { get; set; }
        public string CustomerName { get; set; }
        public string BillNo { get; set; }  
        public long TotalCount { get; set; }
        
    }

    public class BillNoDto
    {
        public string BillNo { get; set; }
      
   
    }

    public class SaleListDto
    {
        public int SaleID { get; set; }
        public string BillNo { get; set; }
        public string SaleTime { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal NetAmount { get; set; }
        public string CustomerName { get; set; }
        public string MobileNumber { get; set; }
        public string UserName { get; set; }
        public string CompanyName { get; set; }
        public decimal? SGST { get; set; }
        public decimal? CGST { get; set; }
        public decimal? halfGstRate { get; set; }
        public int TotalItems { get; set; }
        public List<SaleItemListDto> saleItems { get; set; } = new();
    }

    public class SaleItemListDto
    {
        public int ProductID { get; set; }
        public string Name { get; set; }
        public string Barcode { get; set; }
        public decimal Quantity { get; set; }
        public decimal CostPrice { get; set; }
        public decimal Price { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal Tax { get; set; }
    }


    public class MonthlySalesDto
    {
        public string Month { get; set; }
        public int MonthNumber { get; set; }
        public decimal IncomeInThousands { get; set; }
        public decimal CostOfSalesInThousands { get; set; }
    }

}
