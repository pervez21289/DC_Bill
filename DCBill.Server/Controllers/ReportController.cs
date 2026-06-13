// Controllers/ReportController.cs

using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly IReportRepository _reportRepository;
        private readonly CompanyResolver _companyResolver;

        public ReportController(IReportRepository reportRepository, CompanyResolver companyResolver)
        {
            _reportRepository = reportRepository;
            _companyResolver = companyResolver;
        }

        /// <summary>
        /// Get dashboard statistics (total revenue, invoices, avg value, etc.)
        /// </summary>
        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats(
            [FromQuery] string filterType = "today",
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var companyId = _companyResolver.CurrentCompanyId;

                if (companyId == 0)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Company not found for this user"
                    });
                }

                var stats = await _reportRepository.GetDashboardStatsAsync(filterType, startDate, endDate, companyId);
                var dateRange = await _reportRepository.GetDateRangeAsync(filterType, startDate, endDate);

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Dashboard stats retrieved successfully",
                    Data = new { stats, dateRange }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error retrieving dashboard stats: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Get revenue trend (daily, weekly, monthly, yearly)
        /// </summary>
        [HttpGet("revenue-trend")]
        public async Task<IActionResult> GetRevenueTrend(
            [FromQuery] string trendType = "daily",
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var companyId = _companyResolver.CurrentCompanyId;

                if (companyId == 0)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Company not found for this user"
                    });
                }

                var trends = await _reportRepository.GetRevenueTrendAsync(trendType, startDate, endDate, companyId);

                return Ok(new ApiResponse<IEnumerable<RevenueTrendDto>>
                {
                    Success = true,
                    Message = "Revenue trend retrieved successfully",
                    Data = trends
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error retrieving revenue trend: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Get top products by revenue
        /// </summary>
        [HttpGet("top-products")]
        public async Task<IActionResult> GetTopProducts(
            [FromQuery] int topCount = 5,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var companyId = _companyResolver.CurrentCompanyId;

                if (companyId == 0)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Company not found for this user"
                    });
                }

                var topProducts = await _reportRepository.GetTopProductsAsync(topCount, startDate, endDate, companyId);

                return Ok(new ApiResponse<IEnumerable<TopProductDto>>
                {
                    Success = true,
                    Message = "Top products retrieved successfully",
                    Data = topProducts
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error retrieving top products: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Get recent invoices
        /// </summary>
        [HttpGet("recent-invoices")]
        public async Task<IActionResult> GetRecentInvoices([FromQuery] int count = 10)
        {
            try
            {
                var companyId = _companyResolver.CurrentCompanyId;

                if (companyId == 0)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Company not found for this user"
                    });
                }

                var recentInvoices = await _reportRepository.GetRecentInvoicesAsync(count, companyId);

                return Ok(new ApiResponse<IEnumerable<RecentInvoiceDto>>
                {
                    Success = true,
                    Message = "Recent invoices retrieved successfully",
                    Data = recentInvoices
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error retrieving recent invoices: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Get invoice by ID with all details
        /// </summary>
        [HttpGet("invoice/{invoiceId}")]
        public async Task<IActionResult> GetInvoiceById(int invoiceId)
        {
            try
            {
                var companyId = _companyResolver.CurrentCompanyId;

                if (companyId == 0)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Company not found for this user"
                    });
                }

                var invoice = await _reportRepository.GetInvoiceByIdAsync(invoiceId);

                if (invoice == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Invoice not found"
                    });
                }

                // Verify invoice belongs to the company
                if (invoice.CompanyId != companyId)
                {
                    return Forbid();
                }

                var items = await _reportRepository.GetInvoiceItemsAsync(invoiceId);

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Invoice retrieved successfully",
                    Data = new { Invoice = invoice, Items = items }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error retrieving invoice: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Get invoice items by invoice ID
        /// </summary>
        [HttpGet("invoice/{invoiceId}/items")]
        public async Task<IActionResult> GetInvoiceItems(int invoiceId)
        {
            try
            {
                var companyId = _companyResolver.CurrentCompanyId;

                if (companyId == 0)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Company not found for this user"
                    });
                }

                var invoice = await _reportRepository.GetInvoiceByIdAsync(invoiceId);

                if (invoice == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Invoice not found"
                    });
                }

                // Verify invoice belongs to the company
                if (invoice.CompanyId != companyId)
                {
                    return Forbid();
                }

                var items = await _reportRepository.GetInvoiceItemsAsync(invoiceId);

                return Ok(new ApiResponse<IEnumerable<InvoiceItem>>
                {
                    Success = true,
                    Message = "Invoice items retrieved successfully",
                    Data = items
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error retrieving invoice items: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Get monthly sales summary
        /// </summary>
        [HttpGet("monthly-sales-summary")]
        public async Task<IActionResult> GetMonthlySalesSummary()
        {
            try
            {
                var companyId = _companyResolver.CurrentCompanyId;

                if (companyId == 0)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Company not found for this user"
                    });
                }

                var summary = await _reportRepository.GetMonthlySalesSummaryAsync(companyId);

                return Ok(new ApiResponse<string>
                {
                    Success = true,
                    Message = "Monthly sales summary retrieved successfully",
                    Data = summary
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error retrieving monthly sales summary: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Get total revenue by date range
        /// </summary>
        [HttpGet("total-revenue")]
        public async Task<IActionResult> GetTotalRevenueByDateRange(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            try
            {
                var companyId = _companyResolver.CurrentCompanyId;

                if (companyId == 0)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Company not found for this user"
                    });
                }

                if (startDate > endDate)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Start date must be less than or equal to end date"
                    });
                }

                var totalRevenue = await _reportRepository.GetTotalRevenueByDateRangeAsync(startDate, endDate, companyId);

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Total revenue retrieved successfully",
                    Data = new
                    {
                        StartDate = startDate,
                        EndDate = endDate,
                        TotalRevenue = totalRevenue
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error retrieving total revenue: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Get complete dashboard data in one call (stats, date range, trends)
        /// </summary>
        [HttpGet("complete-dashboard")]
        public async Task<IActionResult> GetCompleteDashboardData(
            [FromQuery] string filterType = "today",
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var companyId = _companyResolver.CurrentCompanyId;

                if (companyId == 0)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Company not found for this user"
                    });
                }

                var (stats, dateRange, trends) = await _reportRepository.GetCompleteDashboardDataAsync(
                    filterType, startDate, endDate, companyId);

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Complete dashboard data retrieved successfully",
                    Data = new { stats, dateRange, trends }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error retrieving complete dashboard data: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Get dashboard summary with multiple metrics
        /// </summary>
        [HttpGet("summary")]
        public async Task<IActionResult> GetDashboardSummary(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var companyId = _companyResolver.CurrentCompanyId;

                if (companyId == 0)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Company not found for this user"
                    });
                }

                // Set default date range to last 30 days if not provided
                if (!startDate.HasValue)
                    startDate = DateTime.Now.AddDays(-30);
                if (!endDate.HasValue)
                    endDate = DateTime.Now;

                var stats = await _reportRepository.GetDashboardStatsAsync("custom", startDate, endDate, companyId);
                var topProducts = await _reportRepository.GetTopProductsAsync(5, startDate, endDate, companyId);
                var recentInvoices = await _reportRepository.GetRecentInvoicesAsync(10, companyId);

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Dashboard summary retrieved successfully",
                    Data = new
                    {
                        Period = new { StartDate = startDate, EndDate = endDate },
                        Statistics = stats,
                        TopProducts = topProducts,
                        RecentInvoices = recentInvoices
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error retrieving dashboard summary: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Get sales analytics with comparison
        /// </summary>
        [HttpGet("sales-analytics")]
        public async Task<IActionResult> GetSalesAnalytics(
            [FromQuery] string period = "month", // week, month, year
            [FromQuery] DateTime? referenceDate = null)
        {
            try
            {
                var companyId = _companyResolver.CurrentCompanyId;

                if (companyId == 0)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Company not found for this user"
                    });
                }

                DateTime currentPeriodStart, currentPeriodEnd;
                DateTime previousPeriodStart, previousPeriodEnd;

                if (!referenceDate.HasValue)
                    referenceDate = DateTime.Now;

                switch (period.ToLower())
                {
                    case "week":
                        currentPeriodStart = referenceDate.Value.AddDays(-7);
                        currentPeriodEnd = referenceDate.Value;
                        previousPeriodStart = currentPeriodStart.AddDays(-7);
                        previousPeriodEnd = currentPeriodStart;
                        break;
                    case "year":
                        currentPeriodStart = referenceDate.Value.AddYears(-1);
                        currentPeriodEnd = referenceDate.Value;
                        previousPeriodStart = currentPeriodStart.AddYears(-1);
                        previousPeriodEnd = currentPeriodStart;
                        break;
                    default: // month
                        currentPeriodStart = referenceDate.Value.AddMonths(-1);
                        currentPeriodEnd = referenceDate.Value;
                        previousPeriodStart = currentPeriodStart.AddMonths(-1);
                        previousPeriodEnd = currentPeriodStart;
                        break;
                }

                var currentPeriodStats = await _reportRepository.GetDashboardStatsAsync(
                    "custom", currentPeriodStart, currentPeriodEnd, companyId);

                var previousPeriodStats = await _reportRepository.GetDashboardStatsAsync(
                    "custom", previousPeriodStart, previousPeriodEnd, companyId);

                // FIXED: Explicitly cast to decimal to avoid ambiguity
                decimal revenueGrowth = 0;
                decimal invoiceGrowth = 0;

                if (previousPeriodStats.TotalRevenue > 0)
                {
                    revenueGrowth = ((currentPeriodStats.TotalRevenue - previousPeriodStats.TotalRevenue) / previousPeriodStats.TotalRevenue) * 100;
                }

                if (previousPeriodStats.TotalInvoices > 0)
                {
                    invoiceGrowth = ((currentPeriodStats.TotalInvoices - previousPeriodStats.TotalInvoices) / (decimal)previousPeriodStats.TotalInvoices) * 100;
                }

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Sales analytics retrieved successfully",
                    Data = new
                    {
                        CurrentPeriod = new { Start = currentPeriodStart, End = currentPeriodEnd, Stats = currentPeriodStats },
                        PreviousPeriod = new { Start = previousPeriodStart, End = previousPeriodEnd, Stats = previousPeriodStats },
                        Growth = new
                        {
                            Revenue = Math.Round(revenueGrowth, 2, MidpointRounding.AwayFromZero),
                            Invoices = Math.Round(invoiceGrowth, 2, MidpointRounding.AwayFromZero),
                            RevenueAbsolute = currentPeriodStats.TotalRevenue - previousPeriodStats.TotalRevenue,
                            InvoiceAbsolute = currentPeriodStats.TotalInvoices - previousPeriodStats.TotalInvoices
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error retrieving sales analytics: {ex.Message}"
                });
            }
        }
    }
}