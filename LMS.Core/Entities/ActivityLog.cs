// Core/Entities/ActivityLog.cs
using System;

namespace LMS.Core.Entities
{
    public class ActivityLog
    {
        public long Id { get; set; }
        public int? UserId { get; set; }
        public int? CompanyId { get; set; }
        public string Action { get; set; }
        public string Entity { get; set; }
        public string EntityId { get; set; }
        public string Details { get; set; }
        public string OldValues { get; set; }
        public string NewValues { get; set; }
        public string RequestBody { get; set; }
        public string Parameters { get; set; }
        public string IpAddress { get; set; }
        public string UserAgent { get; set; }
        public string RequestUrl { get; set; }
        public string RequestMethod { get; set; }
        public int? ResponseStatus { get; set; }
        public int? ExecutionTimeMs { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class RequestInfo
    {
        public int? UserId { get; set; }
        public int? CompanyId { get; set; }
        public string Action { get; set; }
        public string Entity { get; set; }
        public string EntityId { get; set; }
        public string Details { get; set; }
        public string OldValues { get; set; }
        public string NewValues { get; set; }
        public string RequestBody { get; set; }
        public string Parameters { get; set; }
        public string IpAddress { get; set; }
        public string UserAgent { get; set; }
        public string RequestUrl { get; set; }
        public string RequestMethod { get; set; }
        public int? ResponseStatus { get; set; }
        public int? ExecutionTimeMs { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // Models/ActivityLogReport.cs
   
        public class ActivityLogReport
        {
            public int Id { get; set; }
            public int? UserId { get; set; }
            public string UserName { get; set; }
            public int? CompanyId { get; set; }
            public string CompanyName { get; set; }
            public string Action { get; set; }
            public string Entity { get; set; }
            public string EntityId { get; set; }
            public string OldValues { get; set; }
            public string NewValues { get; set; }
            public string OldValuesShort { get; set; }
            public string NewValuesShort { get; set; }
            public string RequestBody { get; set; }
            public string Parameters { get; set; }
            public string IpAddress { get; set; }
            public string UserAgent { get; set; }
            public string RequestUrl { get; set; }
            public string Method { get; set; }
            public string ResponseStatus { get; set; }
            public int? ExecutionTimeMs { get; set; }
            public DateTime CreatedAt { get; set; }
            public int TotalRecords { get; set; }
        }

        public class ActivityLogFilter
        {
            public string Value { get; set; }
            public string Label { get; set; }
        }

        public class ActivityLogFilterOptions
        {
            public List<ActivityLogFilter> Actions { get; set; }
            public List<ActivityLogFilter> Entities { get; set; }
            public List<ActivityLogFilter> Users { get; set; }
        }

        public class ActivityLogRequest
        {
            public int? UserId { get; set; }
            public int? CompanyId { get; set; }
            public string? Action { get; set; }
            public string? Entity { get; set; }
            public DateTime? FromDate { get; set; }
            public DateTime? ToDate { get; set; }
            public int PageNumber { get; set; } = 1;
            public int PageSize { get; set; } = 10;
            public string SortColumn { get; set; } = "CreatedAt";
            public string SortDirection { get; set; } = "DESC";
        }

        public class ActivityLogResponse
        {
            public IEnumerable<ActivityLogReport> Data { get; set; }
            public int TotalRecords { get; set; }
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public int TotalPages => (int)Math.Ceiling((double)TotalRecords / PageSize);
        }
    
}