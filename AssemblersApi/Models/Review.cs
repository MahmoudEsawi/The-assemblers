using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssemblersApi.Models
{
    public class Review
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        public Guid CustomerId { get; set; }
        public virtual User Customer { get; set; } = null!;
        
        [Required]
        public Guid AssemblerId { get; set; }
        public virtual Assembler Assembler { get; set; } = null!;
        
        public Guid? BookingId { get; set; }
        public virtual Booking? Booking { get; set; }
        
        [Required]
        [Range(1, 5)]
        public int Rating { get; set; } // 1-5
        
        [Required]
        [MaxLength(1000)]
        public string Comment { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
