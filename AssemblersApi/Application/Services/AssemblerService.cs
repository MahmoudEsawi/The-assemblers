using AssemblersApi.Application.DTOs;
using AssemblersApi.Application.Interfaces;
using AssemblersApi.Domain.Interfaces;
using AssemblersApi.Domain.Entities;

namespace AssemblersApi.Application.Services;

public class AssemblerService : IAssemblerService
{
    private readonly IAssemblerRepository _assemblerRepository;
    private readonly IUserRepository _userRepository;

    public AssemblerService(IAssemblerRepository assemblerRepository, IUserRepository userRepository)
    {
        _assemblerRepository = assemblerRepository;
        _userRepository = userRepository;
    }

    public async Task<AssemblerDto?> GetByIdAsync(int id)
    {
        var assembler = await _assemblerRepository.GetByIdAsync(id);
        return assembler != null ? await MapToDtoAsync(assembler) : null;
    }

    public async Task<IEnumerable<AssemblerDto>> GetAllAsync()
    {
        var assemblers = await _assemblerRepository.GetAllAsync();
        var assemblerDtos = new List<AssemblerDto>();
        
        foreach (var assembler in assemblers)
        {
            assemblerDtos.Add(await MapToDtoAsync(assembler));
        }
        
        return assemblerDtos;
    }

    public async Task<AssemblerDto> CreateAsync(CreateAssemblerDto createAssemblerDto)
    {
        var user = await _userRepository.GetByIdAsync(createAssemblerDto.UserId);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        var assembler = new Assembler
        {
            UserId = createAssemblerDto.UserId,
            Specialization = createAssemblerDto.Specialization,
            Description = createAssemblerDto.Description,
            Location = createAssemblerDto.Location,
            CoverImage = createAssemblerDto.CoverImage
        };

        var createdAssembler = await _assemblerRepository.AddAsync(assembler);
        return await MapToDtoAsync(createdAssembler);
    }

    public async Task<AssemblerDto?> GetByUserIdAsync(int userId)
    {
        var assembler = await _assemblerRepository.GetByUserIdAsync(userId);
        return assembler != null ? await MapToDtoAsync(assembler) : null;
    }

    public async Task<IEnumerable<AssemblerDto>> GetBySpecializationAsync(string specialization)
    {
        var assemblers = await _assemblerRepository.GetBySpecializationAsync(specialization);
        var assemblerDtos = new List<AssemblerDto>();
        
        foreach (var assembler in assemblers)
        {
            assemblerDtos.Add(await MapToDtoAsync(assembler));
        }
        
        return assemblerDtos;
    }

    public async Task UpdateAsync(int id, UpdateAssemblerDto updateAssemblerDto)
    {
        var assembler = await _assemblerRepository.GetByIdAsync(id);
        if (assembler == null)
        {
            throw new InvalidOperationException($"Assembler with ID {id} not found");
        }

        // Update only provided fields
        if (!string.IsNullOrEmpty(updateAssemblerDto.Specialization))
            assembler.Specialization = updateAssemblerDto.Specialization;
        
        if (!string.IsNullOrEmpty(updateAssemblerDto.Description))
            assembler.Description = updateAssemblerDto.Description;
        
        if (!string.IsNullOrEmpty(updateAssemblerDto.Location))
            assembler.Location = updateAssemblerDto.Location;
        
        if (!string.IsNullOrEmpty(updateAssemblerDto.CoverImage))
            assembler.CoverImage = updateAssemblerDto.CoverImage;
        
        if (updateAssemblerDto.IsVerified.HasValue)
            assembler.IsVerified = updateAssemblerDto.IsVerified.Value;

        await _assemblerRepository.UpdateAsync(assembler);
    }

    public async Task DeleteAsync(int id)
    {
        await _assemblerRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<AssemblerDto>> GetAvailableAssemblersAsync(DateTime date, TimeSpan startTime, TimeSpan endTime)
    {
        var assemblers = await _assemblerRepository.GetAvailableAssemblersAsync(date, startTime, endTime);
        var assemblerDtos = new List<AssemblerDto>();
        
        foreach (var assembler in assemblers)
        {
            assemblerDtos.Add(await MapToDtoAsync(assembler));
        }
        
        return assemblerDtos;
    }

    private async Task<AssemblerDto> MapToDtoAsync(Assembler assembler)
    {
        var user = await _userRepository.GetByIdAsync(assembler.UserId);
        
        return new AssemblerDto
        {
            Id = assembler.Id,
            UserId = assembler.UserId,
            User = user != null ? new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                ProfileImage = user.ProfileImage,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            } : null!,
            Specialization = assembler.Specialization,
            Description = assembler.Description,
            Location = assembler.Location,
            CoverImage = assembler.CoverImage,
            AverageRating = assembler.AverageRating,
            IsVerified = assembler.IsVerified,
            Services = assembler.Services?.Select(s => new ServiceDto
            {
                Id = s.Id,
                CategoryId = s.CategoryId,
                AssemblerId = s.AssemblerId,
                Name = s.Name,
                Description = s.Description,
                Price = s.Price,
                ImageUrl = s.ImageUrl,
                AverageRating = s.AverageRating,
                ReviewCount = s.ReviewCount,
                CreatedAt = s.CreatedAt
            }).ToList() ?? new List<ServiceDto>(),
            Availability = assembler.Availability?.Select(a => new DayAvailabilityDto
            {
                Id = a.Id,
                AssemblerId = a.AssemblerId,
                DayOfWeek = a.DayOfWeek,
                Start = a.Start,
                End = a.End,
                Available = a.Available
            }).ToList() ?? new List<DayAvailabilityDto>(),
            CreatedAt = assembler.CreatedAt
        };
    }
}
