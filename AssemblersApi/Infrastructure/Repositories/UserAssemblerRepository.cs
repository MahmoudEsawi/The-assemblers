using Microsoft.EntityFrameworkCore;
using AssemblersApi.Domain.Entities;
using AssemblersApi.Domain.Interfaces;
using AssemblersApi.Data;

namespace AssemblersApi.Infrastructure.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(AssemblersDbContext context) : base(context) { }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .Where(u => u.Email == email && !u.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _context.Users
            .AnyAsync(u => u.Email == email && !u.IsDeleted);
    }
}

public class AssemblerRepository : Repository<Assembler>, IAssemblerRepository
{
    public AssemblerRepository(AssemblersDbContext context) : base(context) { }

    public override async Task<IEnumerable<Assembler>> GetAllAsync()
    {
        return await _context.Assemblers
            .Include(a => a.User)
            .Include(a => a.Services)
            .Include(a => a.Availability)
            .AsNoTracking()
            .Where(a => !a.IsDeleted)
            .ToListAsync();
    }

    public override async Task<Assembler?> GetByIdAsync(int id)
    {
        return await _context.Assemblers
            .Include(a => a.User)
            .Include(a => a.Services)
            .Include(a => a.Availability)
            .Where(a => a.Id == id && !a.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<Assembler?> GetByUserIdAsync(int userId)
    {
        return await _context.Assemblers
            .Include(a => a.User)
            .Include(a => a.Services)
            .Include(a => a.Availability)
            .Where(a => a.UserId == userId && !a.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Assembler>> GetBySpecializationAsync(string specialization)
    {
        return await _context.Assemblers
            .Include(a => a.User)
            .Include(a => a.Services)
            .Include(a => a.Availability)
            .Where(a => a.Specialization.Contains(specialization) && !a.IsDeleted)
            .ToListAsync();
    }

    public async Task<IEnumerable<Assembler>> GetAvailableAssemblersAsync(DateTime date, TimeSpan startTime, TimeSpan endTime)
    {
        var dayOfWeek = (int)date.DayOfWeek;
        
        return await _context.Assemblers
            .Include(a => a.User)
            .Include(a => a.Services)
            .Include(a => a.Availability)
            .Where(a => !a.IsDeleted && a.Availability.Any(av => 
                av.DayOfWeek == dayOfWeek && 
                av.Available && 
                av.Start <= startTime && 
                av.End >= endTime))
            .ToListAsync();
    }
}
