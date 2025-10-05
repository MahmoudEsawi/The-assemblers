using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AssemblersApi.Data;
using AssemblersApi.Models;

namespace AssemblersApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssemblersController : ControllerBase
    {
        private readonly AssemblersDbContext _context;

        public AssemblersController(AssemblersDbContext context)
        {
            _context = context;
        }

        // GET: api/assemblers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Assembler>>> GetAssemblers()
        {
            return await _context.Assemblers
                .Include(a => a.User)
                .Include(a => a.Services)
                .Include(a => a.Availability)
                .ToListAsync();
        }

        // GET: api/assemblers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Assembler>> GetAssembler(Guid id)
        {
            var assembler = await _context.Assemblers
                .Include(a => a.User)
                .Include(a => a.Services)
                .Include(a => a.Availability)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (assembler == null)
            {
                return NotFound();
            }

            return assembler;
        }

        // GET: api/assemblers/by-user/5
        [HttpGet("by-user/{userId}")]
        public async Task<ActionResult<Assembler>> GetAssemblerByUserId(Guid userId)
        {
            var assembler = await _context.Assemblers
                .Include(a => a.User)
                .Include(a => a.Services)
                .Include(a => a.Availability)
                .FirstOrDefaultAsync(a => a.UserId == userId);

            if (assembler == null)
            {
                return NotFound();
            }

            return assembler;
        }

        // POST: api/assemblers
        [HttpPost]
        public async Task<ActionResult<Assembler>> PostAssembler(Assembler assembler)
        {
            assembler.Id = Guid.NewGuid();
            assembler.CreatedAt = DateTime.UtcNow;
            assembler.UpdatedAt = DateTime.UtcNow;

            _context.Assemblers.Add(assembler);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAssembler", new { id = assembler.Id }, assembler);
        }

        // PUT: api/assemblers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAssembler(Guid id, Assembler assembler)
        {
            if (id != assembler.Id)
            {
                return BadRequest();
            }

            assembler.UpdatedAt = DateTime.UtcNow;
            _context.Entry(assembler).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AssemblerExists(id))
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

        // DELETE: api/assemblers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssembler(Guid id)
        {
            var assembler = await _context.Assemblers.FindAsync(id);
            if (assembler == null)
            {
                return NotFound();
            }

            _context.Assemblers.Remove(assembler);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AssemblerExists(Guid id)
        {
            return _context.Assemblers.Any(e => e.Id == id);
        }
    }
}
