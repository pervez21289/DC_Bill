using Microsoft.AspNetCore.Mvc;
using LMS.Core.Entities;
using LMS.Core.Interfaces;

namespace DCBill.Server.Controllers
{


    [ApiController]
    [Route("api/[controller]")]
    public class BillingSettingsController : ControllerBase
    {
        private readonly IBillingSettingsRepository _repository;

        public BillingSettingsController(
            IBillingSettingsRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _repository.GetAsync();

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
