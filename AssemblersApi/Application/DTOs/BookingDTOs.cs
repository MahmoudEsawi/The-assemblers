using System.ComponentModel.DataAnnotations;
using AssemblersApi.Domain.Enums;

namespace AssemblersApi.Application.DTOs;

// Booking DTOs
public class BookingDto
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public int AssemblerId { get; set; }
    public int ServiceId { get; set; }
    public UserDto Customer { get; set; } = null!;
    public AssemblerDto Assembler { get; set; } = null!;
    public ServiceDto Service { get; set; } = null!;
    public DateTime Date { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string Notes { get; set; } = string.Empty;
    public BookingStatus Status { get; set; }
    public decimal TotalPrice { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateBookingDto
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
    public TimeSpan StartTime { get; set; }
    
    [Required]
    public TimeSpan EndTime { get; set; }
    
    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;
}

public class UpdateBookingDto
{
    public DateTime? Date { get; set; }
    public TimeSpan? StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }
    public string? Notes { get; set; }
    public BookingStatus? Status { get; set; }
}

public class UpdateBookingStatusDto
{
    [Required]
    public BookingStatus Status { get; set; }
}

// Review DTOs
public class ReviewDto
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public int AssemblerId { get; set; }
    public int BookingId { get; set; }
    public UserDto Customer { get; set; } = null!;
    public AssemblerDto Assembler { get; set; } = null!;
    public BookingDto Booking { get; set; } = null!;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateReviewDto
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
    public string Comment { get; set; } = string.Empty;
}

public class UpdateReviewDto
{
    [Range(1, 5)]
    public int? Rating { get; set; }
    
    [MaxLength(1000)]
    public string? Comment { get; set; }
}
