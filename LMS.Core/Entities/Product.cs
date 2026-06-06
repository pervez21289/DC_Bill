using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    public class Product
    {
        public int ProductID { get; set; }
        public string Name { get; set; }
     
        public string Barcode { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public decimal? CostPrice { get; set; }
        public decimal? DiscountAmount { get; set; }
        public decimal? DiscountPercent { get; set; }
        public int Stock { get; set; }
        public int? CategoryID { get; set; }
        public bool IsActive { get; set; }
        public decimal? GstRate { get; set; }
        public int? CompanyID { get; set; }
    }

    public class ProductInventoryLog
    {
        public int LogID { get; set; }
        public int ProductID { get; set; }
        public int QuantityChanged { get; set; }
        public string Reason { get; set; }
        public int UserID { get; set; }
        public string Timestamp { get; set; }
        public string? Name{get;set;}
    }

    public class AdjustStockDto
    {
        public int Quantity { get; set; }
        public string Reason { get; set; }
        public int? UserID { get; set; }
    }
}
