
using LMS.Core.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Data;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Interfaces
{
    public interface ITicketRepository
    {
        Task<IEnumerable<Ticket>> GetTicketsAsync();
        Task<(int Id, string TicketNumber)> CreateTicketAsync(Ticket ticket);
    }
}
