using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AssemblersApi.Data;
using AssemblersApi.Models;

namespace AssemblersApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly AssemblersDbContext _context;

        public BookingsController(AssemblersDbContext context)
        {
            _context = context;
        }

        // GET: api/bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
        {
            return await _context.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Assembler)
                .ThenInclude(a => a.User)
                .Include(b => b.Service)
                .ToListAsync();
        }

        // GET: api/bookings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(Guid id)
        {
            var booking = await _context.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Assembler)
                .ThenInclude(a => a.User)
                .Include(b => b.Service)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null)
            {
                return NotFound();
            }

            return booking;
        }

        // GET: api/bookings/by-customer/5
        [HttpGet("by-customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingsByCustomer(Guid customerId)
        {
            return await _context.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Assembler)
                .ThenInclude(a => a.User)
                .Include(b => b.Service)
                .Where(b => b.CustomerId == customerId)
                .ToListAsync();
        }

        // GET: api/bookings/by-assembler/5
        [HttpGet("by-assembler/{assemblerId}")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingsByAssembler(Guid assemblerId)
        {
            return await _context.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Assembler)
                .ThenInclude(a => a.User)
                .Include(b => b.Service)
                .Where(b => b.AssemblerId == assemblerId)
                .ToListAsync();
        }

        // POST: api/bookings
        [HttpPost]
        public async Task<ActionResult<Booking>> PostBooking(Booking booking)
        {
            booking.Id = Guid.NewGuid();
            booking.CreatedAt = DateTime.UtcNow;
            booking.UpdatedAt = DateTime.UtcNow;

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBooking", new { id = booking.Id }, booking);
        }

        // PUT: api/bookings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBooking(Guid id, Booking booking)
        {
            if (id != booking.Id)
            {
                return BadRequest();
            }

            booking.UpdatedAt = DateTime.UtcNow;
            _context.Entry(booking).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingExists(id))
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

        // DELETE: api/bookings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(Guid id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookingExists(Guid id)
        {
            return _context.Bookings.Any(e => e.Id == id);
        }
    }
}
