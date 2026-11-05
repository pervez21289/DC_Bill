using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repository.Repo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LMS.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly ITicketRepository _tciketRepo;
        private readonly IUserContext _useContext;
        private readonly CompanyResolver _companyResolver;

        public TicketsController(ITicketRepository ticketRepository, CompanyResolver companyResolver)
        {
            _tciketRepo = ticketRepository;
            _companyResolver = companyResolver;
        }

        [HttpGet]
        public async Task<IActionResult> Get() =>
            Ok(await _tciketRepo.GetTicketsAsync(_companyResolver.CurrentUserId));

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Ticket ticket)
        {
            ticket.CompanyId = _companyResolver.CurrentUserId;
            var (id, ticketNumber) = await _tciketRepo.CreateTicketAsync(ticket);

            // Set the returned values back to the object
            ticket.Id = id;
            ticket.TicketNumber = ticketNumber;
            ticket.CreatedAt = DateTime.Now;

            // Return the created resource
            return CreatedAtAction(nameof(Get), ticket);
        }
    }


}
