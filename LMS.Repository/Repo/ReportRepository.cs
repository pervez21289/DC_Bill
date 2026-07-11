// Repo/Repository/ReportRepository.cs
using Dapper;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using System.Data;

namespace LMS.Repo.Repository
{
    public class ReportRepository : BaseRepository, IReportRepository
    {
        public async Task<DashboardStatsDto> GetDashboardStatsAsync(string filterType, DateTime? startDate, DateTime? endDate, int? companyId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@FilterType", filterType ?? "today");
                parameters.Add("@StartDate", startDate);
                parameters.Add("@EndDate", endDate);
                parameters.Add("@CompanyId", companyId);

                var result = await QueryFirstOrDefaultAsync<DashboardStatsDto>(
                    "sp_GetDashboardStats",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result ?? new DashboardStatsDto();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting dashboard stats: {ex.Message}", ex);
            }
        }

        public async Task<DateRangeDto> GetDateRangeAsync(string filterType, DateTime? startDate, DateTime? endDate)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@FilterType", filterType ?? "today");
                parameters.Add("@StartDate", startDate);
                parameters.Add("@EndDate", endDate);

                var result = await QueryFirstOrDefaultAsync<DateRangeDto>(
                    "sp_GetDateRange",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result ?? new DateRangeDto();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting date range: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<RevenueTrendDto>> GetRevenueTrendAsync(string trendType, DateTime? startDate, DateTime? endDate, int? companyId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@TrendType", trendType ?? "daily");
                parameters.Add("@StartDate", startDate);
                parameters.Add("@EndDate", endDate);
                parameters.Add("@CompanyId", companyId);

                var result = await QueryAsync<RevenueTrendDto>(
                    "sp_GetRevenueTrend",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result ?? new List<RevenueTrendDto>();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting revenue trend: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<TopProductDto>> GetTopProductsAsync(int topCount, DateTime? startDate, DateTime? endDate, int? companyId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@TopCount", topCount);
                parameters.Add("@StartDate", startDate);
                parameters.Add("@EndDate", endDate);
                parameters.Add("@CompanyId", companyId);

                var result = await QueryAsync<TopProductDto>(
                    "sp_GetTopProducts",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result ?? new List<TopProductDto>();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting top products: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<RecentInvoiceDto>> GetRecentInvoicesAsync(int count, int? companyId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@Count", count);
                parameters.Add("@CompanyId", companyId);

                var result = await QueryAsync<RecentInvoiceDto>(
                    "sp_GetRecentInvoices",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result ?? new List<RecentInvoiceDto>();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting recent invoices: {ex.Message}", ex);
            }
        }

        public async Task<InvoiceDto> GetInvoiceByIdAsync(int invoiceId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@InvoiceId", invoiceId);

                var result = await QueryFirstOrDefaultAsync<InvoiceDto>(
                    "sp_GetInvoiceById",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting invoice by ID: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<InvoiceItem>> GetInvoiceItemsAsync(int invoiceId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@InvoiceId", invoiceId);

                var result = await QueryAsync<InvoiceItem>(
                    "sp_GetInvoiceItems",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result ?? new List<InvoiceItem>();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting invoice items: {ex.Message}", ex);
            }
        }

        public async Task<string> GetMonthlySalesSummaryAsync(int companyId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@CompanyID", companyId);

                var result = await QueryFirstOrDefaultAsync<string>(
                    "GetSalesSummary",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result ?? "No data available";
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting monthly sales summary: {ex.Message}", ex);
            }
        }

        public async Task<decimal> GetTotalRevenueByDateRangeAsync(DateTime startDate, DateTime endDate, int? companyId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@StartDate", startDate);
                parameters.Add("@EndDate", endDate);
                parameters.Add("@CompanyId", companyId);

                var result = await QueryFirstOrDefaultAsync<decimal>(
                    "sp_GetTotalRevenueByDateRange",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting total revenue: {ex.Message}", ex);
            }
        }

        // Advanced method with multiple result sets
        public async Task<(DashboardStatsDto Stats, DateRangeDto DateRange, IEnumerable<RevenueTrendDto> Trends)> GetCompleteDashboardDataAsync(
            string filterType, DateTime? startDate, DateTime? endDate, int? companyId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@FilterType", filterType ?? "today");
                parameters.Add("@StartDate", startDate);
                parameters.Add("@EndDate", endDate);
                parameters.Add("@CompanyId", companyId);

                var multi = await QueryMultipleAsync<DashboardStatsDto, DateRangeDto, RevenueTrendDto>(
                    "sp_GetCompleteDashboardData",
                    parameters,
                    commandType: CommandType.StoredProcedure);
                
                    var stats =  multi.First.FirstOrDefault() ?? new DashboardStatsDto();
                    var dateRange =  multi.Second.FirstOrDefault() ?? new DateRangeDto();
                    var trends =  multi.Third.ToList() ?? new List<RevenueTrendDto>();

                    return (stats, dateRange, trends);
                
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting complete dashboard data: {ex.Message}", ex);
            }
        }

        // GST Report
        public async Task<GSTReportResponseDto> GetGSTReportAsync(DateTime startDate, DateTime endDate, int? companyId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@StartDate", startDate);
                parameters.Add("@EndDate", endDate);
                parameters.Add("@CompanyId", companyId);

                var multi = await QueryMultipleAsync<GSTReportDto, GSTSummaryDto, HSNWiseSummaryDto, PartyWiseGSTSummaryDto>(
                    "sp_GetGSTReport",
                    parameters,
                    commandType: CommandType.StoredProcedure);

                var invoices = multi.First.ToList() ?? new List<GSTReportDto>();
                var summary = multi.Second.FirstOrDefault() ?? new GSTSummaryDto();
                var hsnSummary = multi.Third.ToList() ?? new List<HSNWiseSummaryDto>();
                var partySummary = multi.Fourth.ToList() ?? new List<PartyWiseGSTSummaryDto>();

                // Get company details for the report header
                var companyParams = new DynamicParameters();
                companyParams.Add("@CompanyId", companyId);
                var company = await QueryFirstOrDefaultAsync<dynamic>(
                    "sp_GetCompanyDetails",
                    companyParams,
                    commandType: CommandType.StoredProcedure);

                summary.HSNWiseSummary = hsnSummary;
                summary.PartyWiseSummary = partySummary;

                return new GSTReportResponseDto
                {
                    Invoices = invoices,
                    Summary = summary,
                    FromDate = startDate,
                    ToDate = endDate,
                    CompanyName = company?.CompanyName ?? "",
                    CompanyGSTIN = company?.GSTIN ?? "",
                    CompanyState = company?.State ?? ""
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting GST report: {ex.Message}", ex);
            }
        }

        // Sales by Payment Mode
        public async Task<IEnumerable<SalesByPaymentModeDto>> GetSalesByPaymentModeAsync(DateTime? startDate, DateTime? endDate, int? companyId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@StartDate", startDate);
                parameters.Add("@EndDate", endDate);
                parameters.Add("@CompanyId", companyId);

                var result = await QueryAsync<SalesByPaymentModeDto>(
                    "sp_GetSalesByPaymentMode",
                    parameters,
                    commandType: CommandType.StoredProcedure);

                return result ?? new List<SalesByPaymentModeDto>();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting sales by payment mode: {ex.Message}", ex);
            }
        }

        // Customer Purchase History
        public async Task<IEnumerable<CustomerPurchaseHistoryDto>> GetCustomerPurchaseHistoryAsync(int customerId, int? companyId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@CustomerId", customerId);
                parameters.Add("@CompanyId", companyId);

                var result = await QueryAsync<CustomerPurchaseHistoryDto>(
                    "sp_GetCustomerPurchaseHistory",
                    parameters,
                    commandType: CommandType.StoredProcedure);

                return result ?? new List<CustomerPurchaseHistoryDto>();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting customer purchase history: {ex.Message}", ex);
            }
        }

        // Daily Sales Report
        public async Task<IEnumerable<DailySalesReportDto>> GetDailySalesReportAsync(DateTime? reportDate, int? companyId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ReportDate", reportDate ?? DateTime.Now.Date);
                parameters.Add("@CompanyId", companyId);

                var result = await QueryAsync<DailySalesReportDto>(
                    "sp_GetDailySalesReport",
                    parameters,
                    commandType: CommandType.StoredProcedure);

                return result ?? new List<DailySalesReportDto>();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting daily sales report: {ex.Message}", ex);
            }
        }

        // Inventory Report
        public async Task<IEnumerable<InventoryReportDto>> GetInventoryReportAsync(DateTime? startDate, DateTime? endDate, int? companyId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@StartDate", startDate);
                parameters.Add("@EndDate", endDate);
                parameters.Add("@CompanyId", companyId);

                var result = await QueryAsync<InventoryReportDto>(
                    "sp_GetInventoryReport",
                    parameters,
                    commandType: CommandType.StoredProcedure);

                return result ?? new List<InventoryReportDto>();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting inventory report: {ex.Message}", ex);
            }
        }
    }
}