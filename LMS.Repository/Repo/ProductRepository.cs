using Dapper;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace LMS.Repository.Repo
{
    public class ProductRepository : BaseRepository,IProductRepository
    {
       

        public async Task<IEnumerable<Product>> GetAllAsync(string search,int CompanyID) =>
     await  QueryAsync<Product>("GetAllProducts",new {search=search,CompanyID=CompanyID}, commandType: CommandType.StoredProcedure);

        public async Task<Product?> GetByIdAsync(int id) =>
            await  QueryFirstOrDefaultAsync<Product>(
                "GetProductById", new { ProductID = id }, commandType: CommandType.StoredProcedure);

        public async Task<int> CreateAsync(Product product) =>
            await  ExecuteScalarAsync<int>(
                "CreateProduct", new
                {
                    product.Name,
                   
                    product.Barcode,
                    product.Description,
                    product.Price,
                    product.CostPrice,
                    product.Stock,
                    product.CategoryID,
                    product.IsActive,
                    product.DiscountAmount,
                    product.DiscountPercent,
                    product.GstRate,
                    product.CompanyID
                }, commandType: CommandType.StoredProcedure);

        public async Task<bool> UpdateAsync(Product product)
        {
           var id= await ExecuteScalarAsync<int>(
                "UpdateProduct", new
                {
                    product.ProductID,
                    product.Name,
                 
                    product.Barcode,
                    product.Description,
                    product.Price,
                    product.CostPrice,
                    product.Stock,
                    product.CategoryID,
                    product.IsActive,
                    product.DiscountAmount,
                    product.DiscountPercent,
                    product.GstRate
                }, commandType: CommandType.StoredProcedure);

            return id > 0;
        }

        public async Task<bool> DeleteAsync(int id) =>
            (await  ExecuteAsync(
                "DeleteProduct", new { ProductID = id }, commandType: CommandType.StoredProcedure)) > 0;


        public async Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm ,int CompanyID)
        {
            return await QueryAsync<Product>(
                "SearchProducts",
                new { SearchTerm = searchTerm , CompanyID = CompanyID },
                commandType: CommandType.StoredProcedure
            );
        }


        public async Task<bool> AdjustStockAsync(int productId, int quantity, string reason, int userId)
        {
            var result = await ExecuteAsync(
                "AdjustProductStock",
                new { ProductID = productId, Quantity = quantity, Reason = reason, UserID = userId },
                commandType: CommandType.StoredProcedure
            );
            return result > 0;
        }

        public async Task<IEnumerable<ProductInventoryLog>> GetInventoryLogsAsync(int productId)
        {
            return await QueryAsync<ProductInventoryLog>(
                "GetProductInventoryLogs",
                new { ProductID = productId },
                commandType: CommandType.StoredProcedure
            );
        }

    }
}
