using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    public class ApiLogEntry
    {
        public DateTime Timestamp { get; set; }
        public string Path { get; set; }
        public string Method { get; set; }
        public string IpAddress { get; set; }
        public int StatusCode { get; set; }
        public long DurationMs { get; set; }
        public long UserId { get; set; }
    }

    public class ApiLog
    {
        public int Id { get; set; }
        public string Timestamp { get; set; }
        public string Path { get; set; }
        public string Method { get; set; }
        public string IpAddress { get; set; }
        public int StatusCode { get; set; }
        public int DurationMs { get; set; }
        public int? UserId { get; set; }
        public string? Name { get; set; }
    }

}
