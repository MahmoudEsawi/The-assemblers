using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AssemblersApi.Data;
using AssemblersApi.Models;

namespace AssemblersApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly AssemblersDbContext _context;

        public ServicesController(AssemblersDbContext context)
        {
            _context = context;
        }

        // GET: api/services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Service>>> GetServices()
        {
            return await _context.Services
                .Include(s => s.Category)
                .Include(s => s.Assembler)
                .ThenInclude(a => a.User)
                .ToListAsync();
        }

        // GET: api/services/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Service>> GetService(Guid id)
        {
            var service = await _context.Services
                .Include(s => s.Category)
                .Include(s => s.Assembler)
                .ThenInclude(a => a.User)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (service == null)
            {
                return NotFound();
            }

            return service;
        }

        // GET: api/services/by-category/5
        [HttpGet("by-category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<Service>>> GetServicesByCategory(Guid categoryId)
        {
            return await _context.Services
                .Include(s => s.Category)
                .Include(s => s.Assembler)
                .ThenInclude(a => a.User)
                .Where(s => s.CategoryId == categoryId)
                .ToListAsync();
        }

        // GET: api/services/by-assembler/5
        [HttpGet("by-assembler/{assemblerId}")]
        public async Task<ActionResult<IEnumerable<Service>>> GetServicesByAssembler(Guid assemblerId)
        {
            return await _context.Services
                .Include(s => s.Category)
                .Include(s => s.Assembler)
                .ThenInclude(a => a.User)
                .Where(s => s.AssemblerId == assemblerId)
                .ToListAsync();
        }

        // POST: api/services
        [HttpPost]
        public async Task<ActionResult<Service>> PostService(Service service)
        {
            service.Id = Guid.NewGuid();
            service.CreatedAt = DateTime.UtcNow;
            service.UpdatedAt = DateTime.UtcNow;

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetService", new { id = service.Id }, service);
        }

        // PUT: api/services/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutService(Guid id, Service service)
        {
            if (id != service.Id)
            {
                return BadRequest();
            }

            service.UpdatedAt = DateTime.UtcNow;
            _context.Entry(service).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceExists(id))
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

        // DELETE: api/services/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(Guid id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
            {
                return NotFound();
            }

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ServiceExists(Guid id)
        {
            return _context.Services.Any(e => e.Id == id);
        }
    }
}
