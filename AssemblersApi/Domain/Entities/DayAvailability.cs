using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssemblersApi.Domain.Entities;

public class DayAvailability : BaseEntity
{
    [Required]
    public int AssemblerId { get; set; }
    
    [Required]
    [Range(0, 6)]
    public int DayOfWeek { get; set; } // 0 = Sunday, 1 = Monday, etc.
    
    [Required]
    [Column(TypeName = "time")]
    public TimeSpan Start { get; set; }
    
    [Required]
    [Column(TypeName = "time")]
    public TimeSpan End { get; set; }
    
    public bool Available { get; set; } = true;
    
    // Navigation properties
    public virtual Assembler Assembler { get; set; } = null!;
}
