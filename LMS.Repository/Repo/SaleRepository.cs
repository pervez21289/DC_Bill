using Dapper;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using static Dapper.SqlMapper;


public class SaleRepository : BaseRepository,ISaleRepository
{

    public async Task<SaleListDto> SaveSaleAsync(SaleDto saleDto)
    {
      

        var saleItemsTable = new DataTable();
        saleItemsTable.Columns.Add("ProductID", typeof(int));
        saleItemsTable.Columns.Add("Quantity", typeof(int));
        saleItemsTable.Columns.Add("CostPrice", typeof(decimal));
        saleItemsTable.Columns.Add("Price", typeof(decimal));
        saleItemsTable.Columns.Add("Discount", typeof(decimal));
        saleItemsTable.Columns.Add("Tax", typeof(decimal));

        foreach (var item in saleDto.saleItems)
        {
            saleItemsTable.Rows.Add(item.ProductID, item.Quantity,item.CostPrice, item.Price, item.Discount, item.Tax);
        }

        var parameters = new DynamicParameters();
        parameters.Add("@UserID", saleDto.UserID);
        parameters.Add("@TotalAmount", saleDto.TotalAmount);
        parameters.Add("@DiscountAmount", saleDto.DiscountAmount);
        parameters.Add("@TaxAmount", saleDto.TaxAmount);
        parameters.Add("@PaymentStatus", saleDto.PaymentStatus);
        parameters.Add("@Notes", saleDto.Notes);
        parameters.Add("@PaymentModeID", saleDto.PaymentModeID); // e.g. "Cash", "UPI"
        parameters.Add("@CustomerName", saleDto.CustomerName);
        parameters.Add("@MobileNumber", saleDto.MobileNumber);
        parameters.Add("@CompanyID", saleDto.CompanyID);
        parameters.Add("@SaleItems", saleItemsTable.AsTableValuedParameter("dbo.SaleItemTableType"));
        parameters.Add("@SaleID", dbType: DbType.Int32, direction: ParameterDirection.Output);

        var (saleItem, saleItems) = await QueryMultipleAsync<SaleListDto, SaleItemListDto>("SaveSaleWithItems", parameters, commandType: CommandType.StoredProcedure);

        saleItem.saleItems = saleItems.ToList();
        return saleItem;

    }

    public async Task<(IEnumerable<Sale> Rows, long Total)> GetSalesAsync(string search,int CompanyID, DateTime? date, int page, int pageSize)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Search", string.IsNullOrWhiteSpace(search) ? null : search);
        parameters.Add("@CompanyID", CompanyID);
        parameters.Add("@Date", date);
        parameters.Add("@Page", page);
        parameters.Add("@PageSize", pageSize);

        IEnumerable<Sale> rows = await QueryAsync<Sale>("GetSalesWithFilters", parameters, commandType: CommandType.StoredProcedure);
        Sale sale= rows.FirstOrDefault();
        long total;
        if (sale == null)
        {
            total = 0;
        }
        else
        {
            total=sale.TotalCount;
        }

        return (rows, total);
    }

    public async Task<SaleListDto?> GetSaleWithItems(int saleId)
    {
        try
        {
            var (saleItem, saleItems) = await QueryMultipleAsync<SaleListDto, SaleItemListDto>(
                "GetSaleWithItems",
                new { SaleID = saleId },
                commandType: CommandType.StoredProcedure
            );

           saleItem.saleItems = saleItems.ToList();
            saleItem.TotalItems = saleItem.saleItems.Count;
           return saleItem;
        }
        catch (Exception ex)
        {
           return null; // Handle or log the exception as needed
        }
       
    }

    public async Task<Customer> GetCustomerByNumber(long mobileNumber)
    {
        try
        {
            Customer rows = await QueryFirstOrDefaultAsync<Customer>("GetCustomerByNumber", new { MobileNumber = mobileNumber }, commandType: CommandType.StoredProcedure);
            return rows;
        }
        catch (Exception ex)
        {
            return null; // Handle or log the exception as needed
        }

    }

    public async Task UpdateSaleOnPrintAsync(int saleId, string CustomerName, string mobile, string paymentMode)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@SaleID", saleId);
        parameters.Add("@CustomerName", CustomerName);
        parameters.Add("@Mobile", mobile);
        parameters.Add("@PaymentMode", paymentMode);

        await ExecuteAsync("UpdateSaleOnPrint", parameters, commandType: CommandType.StoredProcedure);
    }


    public async Task<string> GetMonthlySalesSummary(int CompanyID)
    {
      
        return await QueryFirstOrDefaultAsync<string>(
            "GetSalesSummary", new { CompanyID = CompanyID }, commandType: CommandType.StoredProcedure);
    }
}
