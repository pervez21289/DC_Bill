using Dapper;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
namespace LMS.Repository.Repo
{
    public class TicketRepository :BaseRepository, ITicketRepository
    {
      

        public async Task<IEnumerable<Ticket>> GetTicketsAsync()
        {
            
            return await QueryAsync<Ticket>("sp_GetAllTickets", commandType: CommandType.StoredProcedure);
        }

        public async Task<(int Id, string TicketNumber)> CreateTicketAsync(Ticket ticket)
        {
            var parameters = new
            {
                ticket.Subject,
                ticket.Description,
                ticket.Email,
                ticket.CompanyId
            };
            var result = await QueryFirstOrDefaultAsync<(int Id, string TicketNumber)>("sp_CreateTicket", parameters, commandType: CommandType.StoredProcedure);
            return result;

        }
    }
}
