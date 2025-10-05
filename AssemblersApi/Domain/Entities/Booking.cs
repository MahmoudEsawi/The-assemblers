using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AssemblersApi.Domain.Enums;

namespace AssemblersApi.Domain.Entities;

public class Booking : BaseEntity
{
    [Required]
    public int CustomerId { get; set; }
    
    [Required]
    public int AssemblerId { get; set; }
    
    [Required]
    public int ServiceId { get; set; }
    
    [Required]
    public DateTime Date { get; set; }
    
    [Required]
    [Column(TypeName = "time")]
    public TimeSpan StartTime { get; set; }
    
    [Required]
    [Column(TypeName = "time")]
    public TimeSpan EndTime { get; set; }
    
    [MaxLength(1000)]
    public string? Notes { get; set; }
    
    [Required]
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal TotalPrice { get; set; }
    
    // Navigation properties
    public virtual User Customer { get; set; } = null!;
    
    public virtual Assembler Assembler { get; set; } = null!;
    
    public virtual Service Service { get; set; } = null!;
    
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
