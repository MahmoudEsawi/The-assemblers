using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AssemblersApi.Data;
using AssemblersApi.Models;

namespace AssemblersApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly AssemblersDbContext _context;

        public ReviewsController(AssemblersDbContext context)
        {
            _context = context;
        }

        // GET: api/reviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            return await _context.Reviews
                .Include(r => r.Customer)
                .Include(r => r.Assembler)
                .ThenInclude(a => a.User)
                .Include(r => r.Booking)
                .ToListAsync();
        }

        // GET: api/reviews/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReview(Guid id)
        {
            var review = await _context.Reviews
                .Include(r => r.Customer)
                .Include(r => r.Assembler)
                .ThenInclude(a => a.User)
                .Include(r => r.Booking)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (review == null)
            {
                return NotFound();
            }

            return review;
        }

        // GET: api/reviews/by-assembler/5
        [HttpGet("by-assembler/{assemblerId}")]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviewsByAssembler(Guid assemblerId)
        {
            return await _context.Reviews
                .Include(r => r.Customer)
                .Include(r => r.Assembler)
                .ThenInclude(a => a.User)
                .Include(r => r.Booking)
                .Where(r => r.AssemblerId == assemblerId)
                .ToListAsync();
        }

        // GET: api/reviews/by-customer/5
        [HttpGet("by-customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviewsByCustomer(Guid customerId)
        {
            return await _context.Reviews
                .Include(r => r.Customer)
                .Include(r => r.Assembler)
                .ThenInclude(a => a.User)
                .Include(r => r.Booking)
                .Where(r => r.CustomerId == customerId)
                .ToListAsync();
        }

        // POST: api/reviews
        [HttpPost]
        public async Task<ActionResult<Review>> PostReview(Review review)
        {
            review.Id = Guid.NewGuid();
            review.CreatedAt = DateTime.UtcNow;
            review.UpdatedAt = DateTime.UtcNow;

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            // Update assembler's average rating
            await UpdateAssemblerRating(review.AssemblerId);

            return CreatedAtAction("GetReview", new { id = review.Id }, review);
        }

        // PUT: api/reviews/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReview(Guid id, Review review)
        {
            if (id != review.Id)
            {
                return BadRequest();
            }

            review.UpdatedAt = DateTime.UtcNow;
            _context.Entry(review).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                
                // Update assembler's average rating
                await UpdateAssemblerRating(review.AssemblerId);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReviewExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/reviews/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(Guid id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }

            var assemblerId = review.AssemblerId;
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            // Update assembler's average rating
            await UpdateAssemblerRating(assemblerId);

            return NoContent();
        }

        private bool ReviewExists(Guid id)
        {
            return _context.Reviews.Any(e => e.Id == id);
        }

        private async Task UpdateAssemblerRating(Guid assemblerId)
        {
            var assembler = await _context.Assemblers.FindAsync(assemblerId);
            if (assembler != null)
            {
                var reviews = await _context.Reviews
                    .Where(r => r.AssemblerId == assemblerId)
                    .ToListAsync();

                if (reviews.Any())
                {
                    assembler.AverageRating = (decimal)reviews.Average(r => r.Rating);
                }
                else
                {
                    assembler.AverageRating = 0;
                }

                await _context.SaveChangesAsync();
            }
        }
    }
}
