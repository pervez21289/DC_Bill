using System;
using System.Collections.Generic;
using System.Text;

namespace LMS.Core.Entities
{
    public class Ticket
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? CompanyId { get; set; }
        public string? TicketNumber { get; set; }
    }

}
