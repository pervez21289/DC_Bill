using Microsoft.AspNetCore.Mvc;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace DCBill.Server.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly IEmailSender _emailSender;
        private readonly CompanyResolver _companyResolver;

        public NotificationController(
            IEmailSender emailSender, CompanyResolver companyResolver  )
        {
            _emailSender = emailSender;
            _companyResolver = companyResolver;
        }



        [HttpPost("send-reminder/{invoiceId}")]
        public async Task<IActionResult> SendReminder(int invoiceId, [FromBody] string customMessage = null)
        {
            var result = await _emailSender.SendPaymentReminderAsync(invoiceId, customMessage);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }
    }
}
