using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ItemMasterController : ControllerBase
    {
        private readonly IItemMasterRepository _repository;

        public ItemMasterController(IItemMasterRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<ItemMaster>>>> Get()
        {
            try
            {
                var items = await _repository.GetAsync();
                return Ok(ApiResponse<IEnumerable<ItemMaster>>.Ok(items));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ApiResponse<IEnumerable<ItemMaster>>.Fail(ex.Message));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ItemMaster>>> Get(int id)
        {
            try
            {
                var item = await _repository.GetByIdAsync(id);
                if (item == null)
                {
                    return NotFound(ApiResponse<ItemMaster>.Fail("Item not found"));
                }
                return Ok(ApiResponse<ItemMaster>.Ok(item));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ApiResponse<ItemMaster>.Fail(ex.Message));
            }
        }

        [HttpGet("search/{keyword}")]
        public async Task<ActionResult<ApiResponse<IEnumerable<ItemMaster>>>> Search(string keyword)
        {
            try
            {
                var items = await _repository.SearchAsync(keyword);
                return Ok(ApiResponse<IEnumerable<ItemMaster>>.Ok(items));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ApiResponse<IEnumerable<ItemMaster>>.Fail(ex.Message));
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<int>>> Create([FromBody] ItemMaster model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<int>.Fail("Invalid model state"));
                }

                var id = await _repository.CreateAsync(model);
                if (id == -1)
                {
                    return BadRequest(ApiResponse<int>.Fail("Item with same name already exists"));
                }
                if (id > 0)
                {
                    return Ok(ApiResponse<int>.Ok(id, "Item created successfully"));
                }
                return BadRequest(ApiResponse<int>.Fail("Failed to create item"));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ApiResponse<int>.Fail(ex.Message));
            }
        }

        [HttpPut]
        public async Task<ActionResult<ApiResponse<int>>> Update([FromBody] ItemMaster model)
        {
            try
            {
                if (model.Id == 0)
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
                    return BadRequest(ApiResponse<int>.Fail("Item with same name already exists"));
                }
                if (result > 0)
                {
                    return Ok(ApiResponse<int>.Ok(result, "Item updated successfully"));
                }
                return NotFound(ApiResponse<int>.Fail("Item not found"));
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
                    return Ok(ApiResponse<int>.Ok(result, "Item deleted successfully"));
                }
                return NotFound(ApiResponse<int>.Fail("Item not found"));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ApiResponse<int>.Fail(ex.Message));
            }
        }
    }
}