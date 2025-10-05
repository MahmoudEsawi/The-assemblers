using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssemblersApi.Domain.Entities;

public class Review : BaseEntity
{
    [Required]
    public int CustomerId { get; set; }
    
    [Required]
    public int AssemblerId { get; set; }
    
    [Required]
    public int BookingId { get; set; }
    
    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }
    
    [MaxLength(1000)]
    public string? Comment { get; set; }
    
    // Navigation properties
    public virtual User Customer { get; set; } = null!;
    
    public virtual Assembler Assembler { get; set; } = null!;
    
    public virtual Booking Booking { get; set; } = null!;
}
