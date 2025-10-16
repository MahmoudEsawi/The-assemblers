using System.ComponentModel.DataAnnotations;

namespace AssemblersApi.Application.DTOs;

// Service DTOs
public class ServiceDto
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public int AssemblerId { get; set; }
    public CategoryDto Category { get; set; } = null!;
    public AssemblerDto Assembler { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateServiceDto
{
    [Required]
    public int CategoryId { get; set; }
    
    [Required]
    public int AssemblerId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }
    
    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;
}

// Category DTOs
public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateCategoryDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string Image { get; set; } = string.Empty;
}

public class UpdateCategoryDto
{
    [MaxLength(100)]
    public string? Name { get; set; }
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    [MaxLength(500)]
    public string? Image { get; set; }
}

public class UpdateServiceDto
{
    [MaxLength(200)]
    public string? Name { get; set; }
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [Range(0.01, double.MaxValue)]
    public decimal? Price { get; set; }
    
    [MaxLength(500)]
    public string? ImageUrl { get; set; }
}
