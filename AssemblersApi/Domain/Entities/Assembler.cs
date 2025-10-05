using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssemblersApi.Domain.Entities;

public class Assembler : BaseEntity
{
    [Required]
    public int UserId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Specialization { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    [MaxLength(200)]
    public string? Location { get; set; }
    
    [MaxLength(500)]
    public string? CoverImage { get; set; }
    
    public decimal AverageRating { get; set; } = 0;
    
    public bool IsVerified { get; set; } = false;
    
    // Navigation properties
    public virtual User? User { get; set; }
    
    public virtual ICollection<Service> Services { get; set; } = new List<Service>();
    public virtual ICollection<DayAvailability> Availability { get; set; } = new List<DayAvailability>();
    public virtual ICollection<Booking> AssemblerBookings { get; set; } = new List<Booking>();
    public virtual ICollection<Review> AssemblerReviews { get; set; } = new List<Review>();
}
