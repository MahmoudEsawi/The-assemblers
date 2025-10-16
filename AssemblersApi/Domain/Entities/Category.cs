using System.ComponentModel.DataAnnotations;

namespace AssemblersApi.Domain.Entities;

public class Category : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    [MaxLength(500)]
    public string? Image { get; set; }
    
    // Navigation properties
    public virtual ICollection<Service> Services { get; set; } = new List<Service>();
}
