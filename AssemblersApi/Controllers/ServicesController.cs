using Microsoft.AspNetCore.Mvc;
using AssemblersApi.Application.DTOs;
using AssemblersApi.Application.Interfaces;

namespace AssemblersApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServicesController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetAllServices()
        {
            try
            {
                var services = await _serviceService.GetAllAsync();
                return Ok(services);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving services", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceDto>> GetService(int id)
        {
            try
            {
                var service = await _serviceService.GetByIdAsync(id);
                if (service == null)
                {
                    return NotFound(new { message = $"Service with ID {id} not found" });
                }
                return Ok(service);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving service", error = ex.Message });
            }
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServicesByCategory(int categoryId)
        {
            try
            {
                var services = await _serviceService.GetByCategoryIdAsync(categoryId);
                return Ok(services);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving services", error = ex.Message });
            }
        }

        [HttpGet("assembler/{assemblerId}")]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServicesByAssembler(int assemblerId)
        {
            try
            {
                var services = await _serviceService.GetByAssemblerIdAsync(assemblerId);
                return Ok(services);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving services", error = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> SearchServices([FromQuery] string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return BadRequest(new { message = "Search term is required" });
                }

                var services = await _serviceService.SearchAsync(searchTerm);
                return Ok(services);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error searching services", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<ServiceDto>> CreateService([FromBody] CreateServiceDto serviceDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var service = await _serviceService.CreateAsync(serviceDto);
                return CreatedAtAction(nameof(GetService), new { id = service.Id }, service);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating service", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(int id, [FromBody] UpdateServiceDto serviceDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                await _serviceService.UpdateAsync(id, serviceDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating service", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            try
            {
                await _serviceService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting service", error = ex.Message });
            }
        }

        [HttpGet("test")]
        public ActionResult Test()
        {
            return Ok(new { 
                message = "Services API is working!", 
                timestamp = DateTime.UtcNow,
                endpoint = "GET /api/services"
            });
        }
    }
}