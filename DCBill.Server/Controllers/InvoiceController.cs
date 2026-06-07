using LMS.Core.Entities;
using LMS.API.Repositories;
using LMS.API.Repositories.Interfaces;
using LMS.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceRepository _invoiceRepository;

        public InvoiceController(IInvoiceRepository invoiceRepository)
        {
            _invoiceRepository = invoiceRepository;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<int>>> CreateInvoice([FromBody] CreateInvoiceRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<int>.Fail("Invalid model state"));
                }

                // Create Invoice Master
                var invoiceId = await _invoiceRepository.CreateInvoiceAsync(request);

                if (invoiceId <= 0)
                {
                    return BadRequest(ApiResponse<int>.Fail("Failed to create invoice"));
                }

                // Create Invoice Details
                foreach (var detail in request.Details)
                {
                    await _invoiceRepository.CreateInvoiceDetailAsync(invoiceId, detail);
                }

                return Ok(ApiResponse<long>.Ok(invoiceId, "Invoice created successfully"));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ApiResponse<int>.Fail(ex.Message));
            }
        }
    }
}