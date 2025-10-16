using AssemblersApi.Application.DTOs;
using AssemblersApi.Application.Interfaces;
using AssemblersApi.Domain.Interfaces;
using AssemblersApi.Domain.Entities;

namespace AssemblersApi.Application.Services;

public class ServiceService : IServiceService
{
    private readonly IServiceRepository _serviceRepository;
    private readonly IAssemblerRepository _assemblerRepository;
    private readonly ICategoryService _categoryService;

    public ServiceService(IServiceRepository serviceRepository, IAssemblerRepository assemblerRepository, ICategoryService categoryService)
    {
        _serviceRepository = serviceRepository;
        _assemblerRepository = assemblerRepository;
        _categoryService = categoryService;
    }

    public async Task<ServiceDto?> GetByIdAsync(int id)
    {
        var service = await _serviceRepository.GetByIdAsync(id);
        return service != null ? await MapToDtoAsync(service) : null;
    }

    public async Task<IEnumerable<ServiceDto>> GetAllAsync()
    {
        var services = await _serviceRepository.GetAllAsync();
        var serviceDtos = new List<ServiceDto>();
        
        foreach (var service in services)
        {
            serviceDtos.Add(await MapToDtoAsync(service));
        }
        
        return serviceDtos;
    }

    public async Task<ServiceDto> CreateAsync(CreateServiceDto createServiceDto)
    {
        var service = new Service
        {
            CategoryId = createServiceDto.CategoryId,
            AssemblerId = createServiceDto.AssemblerId,
            Name = createServiceDto.Name,
            Description = createServiceDto.Description,
            Price = createServiceDto.Price,
            ImageUrl = createServiceDto.ImageUrl
        };

        var createdService = await _serviceRepository.AddAsync(service);
        return await MapToDtoAsync(createdService);
    }

    public async Task<IEnumerable<ServiceDto>> GetByCategoryIdAsync(int categoryId)
    {
        var services = await _serviceRepository.GetByCategoryIdAsync(categoryId);
        var serviceDtos = new List<ServiceDto>();
        
        foreach (var service in services)
        {
            serviceDtos.Add(await MapToDtoAsync(service));
        }
        
        return serviceDtos;
    }

    public async Task<IEnumerable<ServiceDto>> GetByAssemblerIdAsync(int assemblerId)
    {
        var services = await _serviceRepository.GetByAssemblerIdAsync(assemblerId);
        var serviceDtos = new List<ServiceDto>();
        
        foreach (var service in services)
        {
            serviceDtos.Add(await MapToDtoAsync(service));
        }
        
        return serviceDtos;
    }

    public async Task UpdateAsync(int id, UpdateServiceDto updateServiceDto)
    {
        var service = await _serviceRepository.GetByIdAsync(id);
        if (service == null)
        {
            throw new InvalidOperationException($"Service with ID {id} not found");
        }

        // Update only provided fields
        if (!string.IsNullOrEmpty(updateServiceDto.Name))
            service.Name = updateServiceDto.Name;
        
        if (!string.IsNullOrEmpty(updateServiceDto.Description))
            service.Description = updateServiceDto.Description;
        
        if (updateServiceDto.Price.HasValue)
            service.Price = updateServiceDto.Price.Value;
        
        if (!string.IsNullOrEmpty(updateServiceDto.ImageUrl))
            service.ImageUrl = updateServiceDto.ImageUrl;

        await _serviceRepository.UpdateAsync(service);
    }

    public async Task DeleteAsync(int id)
    {
        await _serviceRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<ServiceDto>> SearchAsync(string searchTerm)
    {
        var services = await _serviceRepository.SearchAsync(searchTerm);
        var serviceDtos = new List<ServiceDto>();
        
        foreach (var service in services)
        {
            serviceDtos.Add(await MapToDtoAsync(service));
        }
        
        return serviceDtos;
    }

    private async Task<ServiceDto> MapToDtoAsync(Service service)
    {
        var assembler = await _assemblerRepository.GetByIdAsync(service.AssemblerId);
        
            // Use CategoryService to fetch category data
            var category = await _categoryService.GetByIdAsync(service.CategoryId);
        
        return new ServiceDto
        {
            Id = service.Id,
            CategoryId = service.CategoryId,
            AssemblerId = service.AssemblerId,
            Category = category ?? new CategoryDto { Id = service.CategoryId, Name = "Unknown Category" },
            Assembler = assembler != null ? new AssemblerDto
            {
                Id = assembler.Id,
                UserId = assembler.UserId,
                Specialization = assembler.Specialization,
                Description = assembler.Description,
                Location = assembler.Location,
                CoverImage = assembler.CoverImage,
                AverageRating = assembler.AverageRating,
                IsVerified = assembler.IsVerified,
                CreatedAt = assembler.CreatedAt
            } : new AssemblerDto { Id = service.AssemblerId, Specialization = "Unknown Assembler" },
            Name = service.Name,
            Description = service.Description,
            Price = service.Price,
            ImageUrl = service.ImageUrl,
            AverageRating = service.AverageRating,
            ReviewCount = service.ReviewCount,
            CreatedAt = service.CreatedAt
        };
    }
}
