// Controllers/ActivityLogController.cs
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ActivityLogController : ControllerBase
    {
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly CompanyResolver _companyResolver;

        public ActivityLogController(IActivityLogRepository activityLogRepository, CompanyResolver companyResolver)
        {
            _activityLogRepository = activityLogRepository;
            _companyResolver = companyResolver;
        }

        [HttpPost("get-logs")]
        public async Task<IActionResult> GetLogs([FromBody] ActivityLogRequest request)
        {
            try
            {
                request.CompanyId = _companyResolver.CurrentCompanyId;
                var result = await _activityLogRepository.GetActivityLogsAsync(request);
                return Ok(new
                {
                    success = true,
                    data = result.Data,
                    totalRecords = result.TotalRecords,
                    pageNumber = result.PageNumber,
                    pageSize = result.PageSize,
                    totalPages = result.TotalPages
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            try
            {
                var result = await _activityLogRepository.GetFilterOptionsAsync();
                return Ok(new { success = true, data = result });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}