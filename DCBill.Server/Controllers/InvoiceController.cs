using LMS.API.Repositories.Interfaces;
using LMS.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly CompanyResolver _companyResolver;

        public InvoiceController(IInvoiceRepository invoiceRepository, CompanyResolver companyResolver)
        {
            _invoiceRepository = invoiceRepository;
            _companyResolver = companyResolver;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<object>>> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string search = null,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                (IEnumerable<InvoiceMaster> invoices, int totalCount) = await _invoiceRepository.GetAllAsync(
                    page, pageSize, search, startDate, endDate, _companyResolver.CurrentCompanyId);

                return Ok(ApiResponse<object>.Ok(new
                {
                    data = invoices,
                    totalCount = totalCount,
                    currentPage = page,
                    pageSize = pageSize
                }));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ApiResponse<object>.Fail(ex.Message));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<InvoiceMaster>>> GetById(long id)
        {
            try
            {
                var invoice = await _invoiceRepository.GetByIdAsync(id);
                if (invoice == null)
                {
                    return NotFound(ApiResponse<InvoiceMaster>.Fail("Invoice not found"));
                }
                return Ok(ApiResponse<InvoiceMaster>.Ok(invoice));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ApiResponse<InvoiceMaster>.Fail(ex.Message));
            }
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
                request.CompanyId = _companyResolver.CurrentCompanyId;
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


        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<int>>> UpdateInvoice(long id, [FromBody] UpdateInvoiceRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<int>.Fail("Invalid model state"));
                }

                // Create Invoice Master
                request.CompanyId = _companyResolver.CurrentCompanyId;
                request.InvoiceId = id;
                
                var invoiceId = await _invoiceRepository.UpdateInvoiceAsync(request);

                if (invoiceId <= 0)
                {
                    return BadRequest(ApiResponse<int>.Fail("Failed to update invoice"));
                }


                return Ok(ApiResponse<long>.Ok(invoiceId, "Invoice updated successfully"));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ApiResponse<int>.Fail(ex.Message));
            }
        }


    }
}