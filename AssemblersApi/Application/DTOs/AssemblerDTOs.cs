using System.ComponentModel.DataAnnotations;

namespace AssemblersApi.Application.DTOs;

// Assembler DTOs
public class AssemblerDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public UserDto User { get; set; } = null!;
    public string Specialization { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string CoverImage { get; set; } = string.Empty;
    public decimal AverageRating { get; set; }
    public bool IsVerified { get; set; }
    public List<ServiceDto> Services { get; set; } = new();
    public List<DayAvailabilityDto> Availability { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class CreateAssemblerDto
{
    [Required]
    public int UserId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Specialization { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    
    [MaxLength(200)]
    public string Location { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string CoverImage { get; set; } = string.Empty;
}

public class UpdateAssemblerDto
{
    [MaxLength(200)]
    public string? Specialization { get; set; }
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    [MaxLength(200)]
    public string? Location { get; set; }
    
    [MaxLength(500)]
    public string? CoverImage { get; set; }
    
    public bool? IsVerified { get; set; }
}

public class DayAvailabilityDto
{
    public int Id { get; set; }
    public int AssemblerId { get; set; }
    public int DayOfWeek { get; set; }
    public TimeSpan Start { get; set; }
    public TimeSpan End { get; set; }
    public bool Available { get; set; }
}
