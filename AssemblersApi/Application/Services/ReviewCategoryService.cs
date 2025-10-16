using AssemblersApi.Application.DTOs;
using AssemblersApi.Application.Interfaces;
using AssemblersApi.Domain.Interfaces;
using AssemblersApi.Domain.Entities;

namespace AssemblersApi.Application.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IUserRepository _userRepository;
    private readonly IAssemblerRepository _assemblerRepository;
    private readonly IBookingRepository _bookingRepository;

    public ReviewService(
        IReviewRepository reviewRepository,
        IUserRepository userRepository,
        IAssemblerRepository assemblerRepository,
        IBookingRepository bookingRepository)
    {
        _reviewRepository = reviewRepository;
        _userRepository = userRepository;
        _assemblerRepository = assemblerRepository;
        _bookingRepository = bookingRepository;
    }

    public async Task<ReviewDto?> GetByIdAsync(int id)
    {
        var review = await _reviewRepository.GetByIdAsync(id);
        return review != null ? await MapToDtoAsync(review) : null;
    }

    public async Task<IEnumerable<ReviewDto>> GetAllAsync()
    {
        var reviews = await _reviewRepository.GetAllAsync();
        var reviewDtos = new List<ReviewDto>();
        
        foreach (var review in reviews)
        {
            reviewDtos.Add(await MapToDtoAsync(review));
        }
        
        return reviewDtos;
    }

    public async Task<ReviewDto> CreateAsync(CreateReviewDto createReviewDto)
    {
        var review = new Review
        {
            CustomerId = createReviewDto.CustomerId,
            AssemblerId = createReviewDto.AssemblerId,
            BookingId = createReviewDto.BookingId,
            Rating = createReviewDto.Rating,
            Comment = createReviewDto.Comment
        };

        var createdReview = await _reviewRepository.AddAsync(review);
        
        // Update assembler's average rating
        await UpdateAssemblerRating(createReviewDto.AssemblerId);
        
        return await MapToDtoAsync(createdReview);
    }

    public async Task<IEnumerable<ReviewDto>> GetByAssemblerIdAsync(int assemblerId)
    {
        var reviews = await _reviewRepository.GetByAssemblerIdAsync(assemblerId);
        var reviewDtos = new List<ReviewDto>();
        
        foreach (var review in reviews)
        {
            reviewDtos.Add(await MapToDtoAsync(review));
        }
        
        return reviewDtos;
    }

    public async Task UpdateAsync(int id, UpdateReviewDto updateReviewDto)
    {
        var review = await _reviewRepository.GetByIdAsync(id);
        if (review == null)
        {
            throw new InvalidOperationException($"Review with ID {id} not found");
        }

        // Update only provided fields
        if (updateReviewDto.Rating.HasValue)
            review.Rating = updateReviewDto.Rating.Value;
        
        if (!string.IsNullOrEmpty(updateReviewDto.Comment))
            review.Comment = updateReviewDto.Comment;

        await _reviewRepository.UpdateAsync(review);
    }

    public async Task DeleteAsync(int id)
    {
        await _reviewRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<ReviewDto>> GetByBookingIdAsync(int bookingId)
    {
        var reviews = await _reviewRepository.GetByBookingIdAsync(bookingId);
        var reviewDtos = new List<ReviewDto>();
        
        foreach (var review in reviews)
        {
            reviewDtos.Add(await MapToDtoAsync(review));
        }
        
        return reviewDtos;
    }

    public async Task<decimal> GetAverageRatingAsync(int assemblerId)
    {
        return await _reviewRepository.GetAverageRatingAsync(assemblerId);
    }

    private async Task UpdateAssemblerRating(int assemblerId)
    {
        var averageRating = await _reviewRepository.GetAverageRatingAsync(assemblerId);
        var assembler = await _assemblerRepository.GetByIdAsync(assemblerId);
        
        if (assembler != null)
        {
            assembler.AverageRating = averageRating;
            await _assemblerRepository.UpdateAsync(assembler);
        }
    }

    private async Task<ReviewDto> MapToDtoAsync(Review review)
    {
        var customer = await _userRepository.GetByIdAsync(review.CustomerId);
        var assembler = await _assemblerRepository.GetByIdAsync(review.AssemblerId);
        var booking = await _bookingRepository.GetByIdAsync(review.BookingId);
        
        return new ReviewDto
        {
            Id = review.Id,
            CustomerId = review.CustomerId,
            AssemblerId = review.AssemblerId,
            BookingId = review.BookingId,
            Customer = customer != null ? new UserDto
            {
                Id = customer.Id,
                Name = customer.Name,
                Email = customer.Email,
                Phone = customer.Phone,
                Address = customer.Address,
                ProfileImage = customer.ProfileImage,
                Role = customer.Role,
                CreatedAt = customer.CreatedAt
            } : null!,
            Assembler = assembler != null ? new AssemblerDto
            {
                Id = assembler.Id,
                UserId = assembler.UserId,
                Specialization = assembler.Specialization,
                Description = assembler.Description,
                Location = assembler.Location,
                CoverImage = assembler.CoverImage,
                AverageRating = assembler.AverageRating,
                IsVerified = assembler.IsVerified,
                CreatedAt = assembler.CreatedAt
            } : null!,
            Booking = booking != null ? new BookingDto
            {
                Id = booking.Id,
                CustomerId = booking.CustomerId,
                AssemblerId = booking.AssemblerId,
                ServiceId = booking.ServiceId,
                Date = booking.Date,
                StartTime = booking.StartTime,
                EndTime = booking.EndTime,
                Notes = booking.Notes,
                Status = booking.Status,
                TotalPrice = booking.TotalPrice,
                CreatedAt = booking.CreatedAt
            } : null!,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        };
    }
}
