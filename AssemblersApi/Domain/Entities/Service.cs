using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssemblersApi.Domain.Entities;

public class Service : BaseEntity
{
    [Required]
    public int CategoryId { get; set; }
    
    [Required]
    public int AssemblerId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }
    
    [MaxLength(500)]
    public string? ImageUrl { get; set; }
    
    public decimal AverageRating { get; set; } = 0;
    
    public int ReviewCount { get; set; } = 0;
    
    // Navigation properties
    public virtual Category Category { get; set; } = null!;
    
    public virtual Assembler Assembler { get; set; } = null!;
    
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
