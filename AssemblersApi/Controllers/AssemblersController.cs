using Microsoft.AspNetCore.Mvc;
using AssemblersApi.Application.DTOs;
using AssemblersApi.Application.Interfaces;

namespace AssemblersApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssemblersController : ControllerBase
    {
        private readonly IAssemblerService _assemblerService;

        public AssemblersController(IAssemblerService assemblerService)
        {
            _assemblerService = assemblerService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssemblerDto>>> GetAllAssemblers()
        {
            try
            {
                var assemblers = await _assemblerService.GetAllAsync();
                return Ok(assemblers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving assemblers", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AssemblerDto>> GetAssembler(int id)
        {
            try
            {
                var assembler = await _assemblerService.GetByIdAsync(id);
                if (assembler == null)
                {
                    return NotFound(new { message = $"Assembler with ID {id} not found" });
                }
                return Ok(assembler);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving assembler", error = ex.Message });
            }
        }

        [HttpGet("by-user/{userId}")]
        public async Task<ActionResult<AssemblerDto>> GetAssemblerByUserId(int userId)
        {
            try
            {
                var assembler = await _assemblerService.GetByUserIdAsync(userId);
                if (assembler == null)
                {
                    return NotFound(new { message = $"Assembler for user ID {userId} not found" });
                }
                return Ok(assembler);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving assembler", error = ex.Message });
            }
        }

        [HttpGet("specialization/{specialization}")]
        public async Task<ActionResult<IEnumerable<AssemblerDto>>> GetAssemblersBySpecialization(string specialization)
        {
            try
            {
                var assemblers = await _assemblerService.GetBySpecializationAsync(specialization);
                return Ok(assemblers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving assemblers", error = ex.Message });
            }
        }

        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<AssemblerDto>>> GetAvailableAssemblers(
            [FromQuery] DateTime date, 
            [FromQuery] TimeSpan startTime, 
            [FromQuery] TimeSpan endTime)
        {
            try
            {
                var assemblers = await _assemblerService.GetAvailableAssemblersAsync(date, startTime, endTime);
                return Ok(assemblers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving available assemblers", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<AssemblerDto>> CreateAssembler([FromBody] CreateAssemblerDto assemblerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var assembler = await _assemblerService.CreateAsync(assemblerDto);
                return CreatedAtAction(nameof(GetAssembler), new { id = assembler.Id }, assembler);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating assembler", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAssembler(int id, [FromBody] UpdateAssemblerDto assemblerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                await _assemblerService.UpdateAsync(id, assemblerDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating assembler", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssembler(int id)
        {
            try
            {
                await _assemblerService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting assembler", error = ex.Message });
            }
        }

        [HttpGet("test")]
        public ActionResult Test()
        {
            return Ok(new { 
                message = "Assemblers API is working!", 
                timestamp = DateTime.UtcNow,
                endpoint = "GET /api/assemblers"
            });
        }
    }
}