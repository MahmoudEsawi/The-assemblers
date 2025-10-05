using Microsoft.AspNetCore.Mvc;
using AssemblersApi.Application.DTOs;
using AssemblersApi.Application.Interfaces;

namespace AssemblersApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviews()
    {
        var reviews = await _reviewService.GetAllAsync();
        return Ok(reviews);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ReviewDto>> GetReview(int id)
    {
        var review = await _reviewService.GetByIdAsync(id);
        if (review == null)
        {
            return NotFound();
        }
        return Ok(review);
    }

    [HttpPost]
    public async Task<ActionResult<ReviewDto>> CreateReview(CreateReviewDto createReviewDto)
    {
        try
        {
            var review = await _reviewService.CreateAsync(createReviewDto);
            return CreatedAtAction(nameof(GetReview), new { id = review.Id }, review);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("assembler/{assemblerId}")]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviewsByAssembler(int assemblerId)
    {
        var reviews = await _reviewService.GetByAssemblerIdAsync(assemblerId);
        return Ok(reviews);
    }

    [HttpGet("assembler/{assemblerId}/average-rating")]
    public async Task<ActionResult<decimal>> GetAverageRating(int assemblerId)
    {
        var averageRating = await _reviewService.GetAverageRatingAsync(assemblerId);
        return Ok(averageRating);
    }
}