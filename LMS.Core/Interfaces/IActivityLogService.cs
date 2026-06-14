// Core/Interfaces/IReportRepository.cs

using LMS.Core.Entities;



namespace LMS.Core.Interfaces
{
    public interface IActivityLogService
    {
        void LogInformation(string action, string entity = null, string entityId = null, string details = null);
        void LogSuccess(string action, string entity = null, string entityId = null, string details = null);
        void LogError(string action, string entity = null, string entityId = null, string details = null, Exception ex = null);
        void LogCreate<T>(string entity, T newValue, string entityId = null);
        void LogUpdate<T>(string entity, T oldValue, T newValue, string entityId = null);
        void LogDelete<T>(string entity, T oldValue, string entityId = null);
    }
}