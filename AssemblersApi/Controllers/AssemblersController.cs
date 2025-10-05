using Microsoft.AspNetCore.Mvc;
using AssemblersApi.Application.DTOs;
using AssemblersApi.Application.Interfaces;

namespace AssemblersApi.Controllers;

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
    public async Task<ActionResult<IEnumerable<AssemblerDto>>> GetAssemblers()
    {
        var assemblers = await _assemblerService.GetAllAsync();
        return Ok(assemblers);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AssemblerDto>> GetAssembler(int id)
    {
        var assembler = await _assemblerService.GetByIdAsync(id);
        if (assembler == null)
        {
            return NotFound();
        }
        return Ok(assembler);
    }

    [HttpPost]
    public async Task<ActionResult<AssemblerDto>> CreateAssembler(CreateAssemblerDto createAssemblerDto)
    {
        try
        {
            var assembler = await _assemblerService.CreateAsync(createAssemblerDto);
            return CreatedAtAction(nameof(GetAssembler), new { id = assembler.Id }, assembler);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("by-user/{userId}")]
    public async Task<ActionResult<AssemblerDto>> GetAssemblerByUserId(int userId)
    {
        var assembler = await _assemblerService.GetByUserIdAsync(userId);
        if (assembler == null)
        {
            return NotFound();
        }
        return Ok(assembler);
    }

    [HttpGet("specialization/{specialization}")]
    public async Task<ActionResult<IEnumerable<AssemblerDto>>> GetAssemblersBySpecialization(string specialization)
    {
        var assemblers = await _assemblerService.GetBySpecializationAsync(specialization);
        return Ok(assemblers);
    }

    [HttpGet("available")]
    public async Task<ActionResult<IEnumerable<AssemblerDto>>> GetAvailableAssemblers(
        [FromQuery] DateTime date,
        [FromQuery] TimeSpan startTime,
        [FromQuery] TimeSpan endTime)
    {
        var assemblers = await _assemblerService.GetAvailableAssemblersAsync(date, startTime, endTime);
        return Ok(assemblers);
    }
}