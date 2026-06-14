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
}