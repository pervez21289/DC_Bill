// Core/Interfaces/IReportRepository.cs

using LMS.Core.Entities;



namespace LMS.Core.Interfaces
{
    public interface IActivityLogRepository
    {
        Task<ActivityLogResponse> GetActivityLogsAsync(ActivityLogRequest request);
        Task<ActivityLogFilterOptions> GetFilterOptionsAsync();
    }
}