// Core/Interfaces/IReportRepository.cs

using LMS.Core.Entities;



namespace LMS.Core.Interfaces
{
    public interface IReportRepository
    {
        // Dashboard Stats
        Task<DashboardStatsDto> GetDashboardStatsAsync(string filterType, DateTime? startDate, DateTime? endDate, int? companyId);
        Task<DateRangeDto> GetDateRangeAsync(string filterType, DateTime? startDate, DateTime? endDate);

        // Revenue Trends
        Task<IEnumerable<RevenueTrendDto>> GetRevenueTrendAsync(string trendType, DateTime? startDate, DateTime? endDate, int? companyId);

        // Top Products
        Task<IEnumerable<TopProductDto>> GetTopProductsAsync(int topCount, DateTime? startDate, DateTime? endDate, int? companyId);

        // Recent Invoices
        Task<IEnumerable<RecentInvoiceDto>> GetRecentInvoicesAsync(int count, int? companyId);

        // Invoice Details
        Task<InvoiceDto> GetInvoiceByIdAsync(int invoiceId);
        Task<IEnumerable<InvoiceItem>> GetInvoiceItemsAsync(int invoiceId);

        // Sales Summary
        Task<string> GetMonthlySalesSummaryAsync(int companyId);
        Task<decimal> GetTotalRevenueByDateRangeAsync(DateTime startDate, DateTime endDate, int? companyId);

        // Complete Dashboard Data (Multiple Result Sets)
        Task<(DashboardStatsDto Stats, DateRangeDto DateRange, IEnumerable<RevenueTrendDto> Trends)> GetCompleteDashboardDataAsync(
            string filterType, DateTime? startDate, DateTime? endDate, int? companyId);

        //// Additional Report Methods
        Task<GSTReportResponseDto> GetGSTReportAsync(DateTime startDate, DateTime endDate, int? companyId);
        Task<IEnumerable<SalesByPaymentModeDto>> GetSalesByPaymentModeAsync(DateTime? startDate, DateTime? endDate, int? companyId);
        Task<IEnumerable<CustomerPurchaseHistoryDto>> GetCustomerPurchaseHistoryAsync(int customerId, int? companyId);
        Task<IEnumerable<DailySalesReportDto>> GetDailySalesReportAsync(DateTime? reportDate, int? companyId);
        Task<IEnumerable<InventoryReportDto>> GetInventoryReportAsync(DateTime? startDate, DateTime? endDate, int? companyId);
    }
}