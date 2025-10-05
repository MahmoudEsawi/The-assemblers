using System.ComponentModel.DataAnnotations;

namespace AssemblersApi.Domain.Entities;

public class User : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
    public string Password { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? Phone { get; set; }
    
    [MaxLength(500)]
    public string? Address { get; set; }
    
    [MaxLength(500)]
    public string? ProfileImage { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Role { get; set; } = "Customer";
    
    // Navigation properties
    public virtual ICollection<Assembler> AssemblerProfiles { get; set; } = new List<Assembler>();
    public virtual ICollection<Booking> CustomerBookings { get; set; } = new List<Booking>();
    public virtual ICollection<Review> CustomerReviews { get; set; } = new List<Review>();
}
