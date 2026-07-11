using Microsoft.AspNetCore.Mvc;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace DCBill.Server.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BillingSettingsController : ControllerBase
    {
        private readonly IBillingSettingsRepository _repository;
        private readonly CompanyResolver _companyResolver;

        public BillingSettingsController(
            IBillingSettingsRepository repository, CompanyResolver companyResolver  )
        {
            _repository = repository;
            _companyResolver = companyResolver;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _repository.GetAsync(_companyResolver.CurrentUserId);

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Save(
            BillingSettings model)
        {
            if (model.Id == 0)
            {
                var id = await _repository.CreateAsync(model);

                return Ok(new
                {
                    Message = "Created successfully",
                    Id = id
                });
            }

            await _repository.UpdateAsync(model);

            return Ok(new
            {
                Message = "Updated successfully"
            });
        }
    }
}
