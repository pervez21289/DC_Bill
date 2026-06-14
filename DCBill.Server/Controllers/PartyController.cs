using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PartyController : ControllerBase
    {
        private readonly IPartyRepository _repository;
        private readonly CompanyResolver _companyResolver;

        public PartyController(IPartyRepository repository, CompanyResolver companyResolver)
        {
            _repository = repository;
            _companyResolver = companyResolver;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<Party>>>> Get()
        {
            try
            {
                var parties = await _repository.GetAsync(_companyResolver.CurrentCompanyId);
                return Ok(ApiResponse<IEnumerable<Party>>.Ok(parties));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ApiResponse<IEnumerable<Party>>.Fail(ex.Message));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Party>>> Get(int id)
        {
            try
            {
                var party = await _repository.GetByIdAsync(id);
                if (party == null)
                {
                    return NotFound(ApiResponse<Party>.Fail("Party not found"));
                }
                return Ok(ApiResponse<Party>.Ok(party));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ApiResponse<Party>.Fail(ex.Message));
            }
        }

        [HttpGet("gstin/{gstin}")]
        public async Task<ActionResult<ApiResponse<Party>>> GetByGSTIN(string gstin)
        {
            try
            {
                var party = await _repository.GetByGSTINAsync(gstin);
                if (party == null)
                {
                    return NotFound(ApiResponse<Party>.Fail("Party not found"));
                }
                return Ok(ApiResponse<Party>.Ok(party));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ApiResponse<Party>.Fail(ex.Message));
            }
        }

        [HttpGet("search/{keyword}")]
        public async Task<ActionResult<ApiResponse<IEnumerable<Party>>>> Search(string keyword)
        {
            try
            {
                var parties = await _repository.SearchAsync(keyword);
                return Ok(ApiResponse<IEnumerable<Party>>.Ok(parties));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ApiResponse<IEnumerable<Party>>.Fail(ex.Message));
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<int>>> Create([FromBody] Party model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<int>.Fail("Invalid model state"));
                }
                model.CompanyId = _companyResolver.CurrentCompanyId;
                var id = await _repository.CreateAsync(model);
                if (id == -1)
                {
                    return BadRequest(ApiResponse<int>.Fail("Party with same GSTIN already exists"));
                }
                if (id == -2)
                {
                    return BadRequest(ApiResponse<int>.Fail("Party with same name already exists"));
                }
                if (id > 0)
                {
                    return Ok(ApiResponse<int>.Ok(id, "Party created successfully"));
                }
                return BadRequest(ApiResponse<int>.Fail("Failed to create party"));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ApiResponse<int>.Fail(ex.Message));
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<int>>> Update(int id, [FromBody] Party model)
        {
            try
            {
                if (id != model.Id)
                {
                    return BadRequest(ApiResponse<int>.Fail("ID mismatch"));
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<int>.Fail("Invalid model state"));
                }

                var result = await _repository.UpdateAsync(model);
                if (result == -1)
                {
                    return BadRequest(ApiResponse<int>.Fail("Party with same GSTIN already exists"));
                }
                if (result == -2)
                {
                    return BadRequest(ApiResponse<int>.Fail("Party with same name already exists"));
                }
                if (result > 0)
                {
                    return Ok(ApiResponse<int>.Ok(result, "Party updated successfully"));
                }
                return NotFound(ApiResponse<int>.Fail("Party not found"));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ApiResponse<int>.Fail(ex.Message));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<int>>> Delete(int id)
        {
            try
            {
                var result = await _repository.DeleteAsync(id);
                if (result > 0)
                {
                    return Ok(ApiResponse<int>.Ok(result, "Party deleted successfully"));
                }
                return NotFound(ApiResponse<int>.Fail("Party not found"));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ApiResponse<int>.Fail(ex.Message));
            }
        }
    }
}