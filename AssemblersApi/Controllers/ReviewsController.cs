using Microsoft.AspNetCore.Mvc;
using AssemblersApi.Application.DTOs;
using AssemblersApi.Application.Interfaces;

namespace AssemblersApi.Controllers
{
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
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetAllReviews()
        {
            try
            {
                var reviews = await _reviewService.GetAllAsync();
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving reviews", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewDto>> GetReview(int id)
        {
            try
            {
                var review = await _reviewService.GetByIdAsync(id);
                if (review == null)
                {
                    return NotFound(new { message = $"Review with ID {id} not found" });
                }
                return Ok(review);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving review", error = ex.Message });
            }
        }

        [HttpGet("assembler/{assemblerId}")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviewsByAssembler(int assemblerId)
        {
            try
            {
                var reviews = await _reviewService.GetByAssemblerIdAsync(assemblerId);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving reviews", error = ex.Message });
            }
        }

        [HttpGet("booking/{bookingId}")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviewsByBooking(int bookingId)
        {
            try
            {
                var reviews = await _reviewService.GetByBookingIdAsync(bookingId);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving reviews", error = ex.Message });
            }
        }

        [HttpGet("assembler/{assemblerId}/average-rating")]
        public async Task<ActionResult<decimal>> GetAverageRating(int assemblerId)
        {
            try
            {
                var averageRating = await _reviewService.GetAverageRatingAsync(assemblerId);
                return Ok(new { averageRating });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving average rating", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<ReviewDto>> CreateReview([FromBody] CreateReviewDto reviewDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var review = await _reviewService.CreateAsync(reviewDto);
                return CreatedAtAction(nameof(GetReview), new { id = review.Id }, review);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating review", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] UpdateReviewDto reviewDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                await _reviewService.UpdateAsync(id, reviewDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating review", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            try
            {
                await _reviewService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting review", error = ex.Message });
            }
        }

        [HttpGet("test")]
        public ActionResult Test()
        {
            return Ok(new { 
                message = "Reviews API is working!", 
                timestamp = DateTime.UtcNow,
                endpoint = "GET /api/reviews"
            });
        }
    }
}