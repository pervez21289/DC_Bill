using LMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync(string search, int CompanyID);
        Task<Product?> GetByIdAsync(int id);
        Task<int> CreateAsync(Product product);
        Task<bool> UpdateAsync(Product product);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm, int CompanyID);
        Task<bool> AdjustStockAsync(int productId, int quantity, string reason, int userId);
        Task<IEnumerable<ProductInventoryLog>> GetInventoryLogsAsync(int productId);
    }
}
