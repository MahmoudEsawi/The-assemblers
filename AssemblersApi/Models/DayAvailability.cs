using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssemblersApi.Models
{
    public class DayAvailability
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        [MaxLength(10)]
        public string Start { get; set; } = string.Empty; // Format: "09:00"
        
        [Required]
        [MaxLength(10)]
        public string End { get; set; } = string.Empty; // Format: "17:00"
        
        public bool Available { get; set; } = true;
        
        [Required]
        [MaxLength(20)]
        public string DayOfWeek { get; set; } = string.Empty; // monday, tuesday, etc.
        
        public Guid AssemblerId { get; set; }
        public virtual Assembler Assembler { get; set; } = null!;
    }
}
