using Microsoft.AspNetCore.Mvc;
using AssemblersApi.Application.Interfaces;
using AssemblersApi.Domain.Interfaces;

namespace AssemblersApi.Controllers;

[ApiController]
[Route("api/debug")]
public class DebugController : ControllerBase
{
    private readonly IServiceRepository _serviceRepository;
    private readonly ICategoryRepository _categoryRepository;

    public DebugController(IServiceRepository serviceRepository, ICategoryRepository categoryRepository)
    {
        _serviceRepository = serviceRepository;
        _categoryRepository = categoryRepository;
    }

    [HttpGet("services")]
    public async Task<ActionResult> DebugServices()
    {
        var services = await _serviceRepository.GetAllAsync();
        var firstService = services.FirstOrDefault();
        
        return Ok(new {
            serviceId = firstService?.Id,
            categoryId = firstService?.CategoryId,
            assemblerId = firstService?.AssemblerId,
            categoryName = firstService?.Category?.Name,
            assemblerName = firstService?.Assembler?.User?.Name,
            categoryLoaded = firstService?.Category != null,
            assemblerLoaded = firstService?.Assembler != null
        });
    }

    [HttpGet("category/{id}")]
    public async Task<ActionResult> DebugCategory(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        
        return Ok(new {
            categoryId = category?.Id,
            categoryName = category?.Name,
            categoryExists = category != null
        });
    }
}
