using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssemblersApi.Models
{
    public class Booking
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        public Guid CustomerId { get; set; }
        public virtual User Customer { get; set; } = null!;
        
        [Required]
        public Guid AssemblerId { get; set; }
        public virtual Assembler Assembler { get; set; } = null!;
        
        [Required]
        public Guid ServiceId { get; set; }
        public virtual Service Service { get; set; } = null!;
        
        [Required]
        public DateTime Date { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "pending"; // pending, confirmed, in-progress, completed, cancelled
        
        [MaxLength(1000)]
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
