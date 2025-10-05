using Microsoft.AspNetCore.Mvc;
using AssemblersApi.Application.DTOs;
using AssemblersApi.Application.Interfaces;
using AssemblersApi.Domain.Interfaces;

namespace AssemblersApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase
{
    private readonly IServiceService _serviceService;
    private readonly IServiceRepository _serviceRepository;

    public ServicesController(IServiceService serviceService, IServiceRepository serviceRepository)
    {
        _serviceService = serviceService;
        _serviceRepository = serviceRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServices()
    {
        var services = await _serviceService.GetAllAsync();
        return Ok(services);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceDto>> GetService(int id)
    {
        var service = await _serviceService.GetByIdAsync(id);
        if (service == null)
        {
            return NotFound();
        }
        return Ok(service);
    }

    [HttpPost]
    public async Task<ActionResult<ServiceDto>> CreateService(CreateServiceDto createServiceDto)
    {
        try
        {
            var service = await _serviceService.CreateAsync(createServiceDto);
            return CreatedAtAction(nameof(GetService), new { id = service.Id }, service);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServicesByCategory(int categoryId)
    {
        var services = await _serviceService.GetByCategoryIdAsync(categoryId);
        return Ok(services);
    }

    [HttpGet("assembler/{assemblerId}")]
    public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServicesByAssembler(int assemblerId)
    {
        var services = await _serviceService.GetByAssemblerIdAsync(assemblerId);
        return Ok(services);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<ServiceDto>>> SearchServices([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            return BadRequest("Search query is required");
        }

        var services = await _serviceService.SearchAsync(q);
        return Ok(services);
    }
}