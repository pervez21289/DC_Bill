// Repositories/ActivityLogRepository.cs
using Dapper;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Core.Models;
using LMS.Repo.Repository;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LMS.API.Repositories
{
    public class ActivityLogRepository : BaseRepository, IActivityLogRepository
    {
       

        public async Task<ActivityLogResponse> GetActivityLogsAsync(ActivityLogRequest request)
        {
            var parameters = new
            {
                request.UserId,
                request.CompanyId,
                request.Action,
                request.Entity,
                request.FromDate,
                request.ToDate,
                request.PageNumber,
                request.PageSize,
                request.SortColumn,
                request.SortDirection
            };

            var sql = "sp_GetActivityLogsReport";

            
            var result = await QueryAsync<ActivityLogReport>(
                sql,
                parameters,
                commandType: CommandType.StoredProcedure
            );

            var data = result.AsList();
            var totalRecords = data.Count > 0 ? data[0].TotalRecords : 0;

            return new ActivityLogResponse
            {
                Data = data,
                TotalRecords = totalRecords,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }

        public async Task<ActivityLogFilterOptions> GetFilterOptionsAsync()
        {
            var sql = "sp_GetActivityLogFilters";
          
            var multi = await QueryMultipleIenumAsync<ActivityLogFilter, ActivityLogFilter>(
                sql,
                null,
                commandType: CommandType.StoredProcedure
            );

            return new ActivityLogFilterOptions
            {
                Actions = multi.First.ToList(),
                Entities = multi.Second.ToList()
            };
        }
    }
}