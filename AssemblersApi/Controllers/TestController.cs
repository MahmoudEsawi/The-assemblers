using Microsoft.AspNetCore.Mvc;
using AssemblersApi.Data;
using Microsoft.EntityFrameworkCore;

namespace AssemblersApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly AssemblersDbContext _context;

        public TestController(AssemblersDbContext context)
        {
            _context = context;
        }

        [HttpGet("database")]
        public async Task<ActionResult> TestDatabase()
        {
            try
            {
                // Test database connection
                var userCount = await _context.Users.CountAsync();
                var assemblerCount = await _context.Assemblers.CountAsync();
                var serviceCount = await _context.Services.CountAsync();
                var categoryCount = await _context.Categories.CountAsync();
                var bookingCount = await _context.Bookings.CountAsync();

                return Ok(new
                {
                    message = "Database connection successful",
                    timestamp = DateTime.UtcNow,
                    counts = new
                    {
                        users = userCount,
                        assemblers = assemblerCount,
                        services = serviceCount,
                        categories = categoryCount,
                        bookings = bookingCount
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Database connection failed",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }

        [HttpGet("assemblers")]
        public async Task<ActionResult> TestAssemblers()
        {
            try
            {
                var assemblers = await _context.Assemblers
                    .Include(a => a.User)
                    .Include(a => a.Services)
                    .Take(5)
                    .Select(a => new
                    {
                        a.Id,
                        a.User.Name,
                        a.User.Email,
                        a.Specialization,
                        a.Location,
                        ServiceCount = a.Services.Count()
                    })
                    .ToListAsync();

                return Ok(new
                {
                    message = "Assemblers data retrieved successfully",
                    count = assemblers.Count,
                    assemblers
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error retrieving assemblers",
                    error = ex.Message
                });
            }
        }

        [HttpGet("services")]
        public async Task<ActionResult> TestServices()
        {
            try
            {
                var services = await _context.Services
                    .Include(s => s.Assembler)
                    .Include(s => s.Category)
                    .Take(5)
                    .Select(s => new
                    {
                        s.Id,
                        s.Name,
                        s.Price,
                        s.Description,
                        AssemblerName = s.Assembler.User.Name,
                        CategoryName = s.Category.Name
                    })
                    .ToListAsync();

                return Ok(new
                {
                    message = "Services data retrieved successfully",
                    count = services.Count,
                    services
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error retrieving services",
                    error = ex.Message
                });
            }
        }

        [HttpGet("categories")]
        public async Task<ActionResult> TestCategories()
        {
            try
            {
                var categories = await _context.Categories
                    .Take(5)
                    .Select(c => new
                    {
                        c.Id,
                        c.Name,
                        c.Description
                    })
                    .ToListAsync();

                return Ok(new
                {
                    message = "Categories data retrieved successfully",
                    count = categories.Count,
                    categories
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error retrieving categories",
                    error = ex.Message
                });
            }
        }

        [HttpGet("users")]
        public async Task<ActionResult> TestUsers()
        {
            try
            {
                var users = await _context.Users
                    .Take(5)
                    .Select(u => new
                    {
                        u.Id,
                        u.Name,
                        u.Email,
                        u.Role,
                        u.CreatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    message = "Users data retrieved successfully",
                    count = users.Count,
                    users
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error retrieving users",
                    error = ex.Message
                });
            }
        }

        [HttpGet("health")]
        public ActionResult HealthCheck()
        {
            return Ok(new
            {
                status = "Healthy",
                timestamp = DateTime.UtcNow,
                version = "1.0.0",
                environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development"
            });
        }
    }
}