using Dapper;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using System;
using System.Data;

namespace LMS.Repository.Repo
{
    public class ErrorLogger :BaseRepository, IErrorLogger
    {

        public  async Task BulkInsertLogsAsync(DataTable dataTablelogs)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Logs", dataTablelogs.AsTableValuedParameter("dbo.ActivityLogType"));

            await ExecuteAsync(
                "sp_InsertActivityLogs",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }
    }

}
