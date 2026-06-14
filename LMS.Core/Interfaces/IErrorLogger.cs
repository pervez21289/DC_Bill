using System.Data;

namespace LMS.Core.Interfaces
{
    public interface IErrorLogger
    {
        Task BulkInsertLogsAsync(DataTable dataTablelogs);
    }
}
