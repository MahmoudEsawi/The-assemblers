using Microsoft.EntityFrameworkCore;
using AssemblersApi.Domain.Entities;
using AssemblersApi.Domain.Interfaces;
using AssemblersApi.Data;
using AssemblersApi.Domain.Enums;

namespace AssemblersApi.Infrastructure.Repositories;

public class ServiceRepository : Repository<Service>, IServiceRepository
{
    public ServiceRepository(AssemblersDbContext context) : base(context) { }

    public override async Task<IEnumerable<Service>> GetAllAsync()
    {
        return await _dbSet
            .Include(s => s.Category)
            .Include(s => s.Assembler)
            .ThenInclude(a => a.User)
            .Where(s => !s.IsDeleted)
            .ToListAsync();
    }

    public override async Task<Service?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(s => s.Category)
            .Include(s => s.Assembler)
            .ThenInclude(a => a.User)
            .Where(s => s.Id == id && !s.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Service>> GetByCategoryIdAsync(int categoryId)
    {
        return await _dbSet
            .Include(s => s.Category)
            .Include(s => s.Assembler)
            .ThenInclude(a => a.User)
            .Where(s => s.CategoryId == categoryId && !s.IsDeleted)
            .ToListAsync();
    }

    public async Task<IEnumerable<Service>> GetByAssemblerIdAsync(int assemblerId)
    {
        return await _dbSet
            .Include(s => s.Category)
            .Include(s => s.Assembler)
            .ThenInclude(a => a.User)
            .Where(s => s.AssemblerId == assemblerId && !s.IsDeleted)
            .ToListAsync();
    }

    public async Task<IEnumerable<Service>> SearchAsync(string searchTerm)
    {
        return await _dbSet
            .Include(s => s.Category)
            .Include(s => s.Assembler)
            .ThenInclude(a => a.User)
            .Where(s => !s.IsDeleted && 
                (s.Name.Contains(searchTerm) || 
                 s.Description.Contains(searchTerm) ||
                 s.Category.Name.Contains(searchTerm)))
            .ToListAsync();
    }
}

public class BookingRepository : Repository<Booking>, IBookingRepository
{
    public BookingRepository(AssemblersDbContext context) : base(context) { }

    public override async Task<IEnumerable<Booking>> GetAllAsync()
    {
        return await _dbSet
            .Include(b => b.Customer)
            .Include(b => b.Assembler)
            .ThenInclude(a => a.User)
            .Include(b => b.Service)
            .ThenInclude(s => s.Category)
            .Where(b => !b.IsDeleted)
            .ToListAsync();
    }

    public override async Task<Booking?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(b => b.Customer)
            .Include(b => b.Assembler)
            .ThenInclude(a => a.User)
            .Include(b => b.Service)
            .ThenInclude(s => s.Category)
            .Where(b => b.Id == id && !b.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Booking>> GetByCustomerIdAsync(int customerId)
    {
        return await _dbSet
            .Include(b => b.Customer)
            .Include(b => b.Assembler)
            .ThenInclude(a => a.User)
            .Include(b => b.Service)
            .Where(b => b.CustomerId == customerId && !b.IsDeleted)
            .OrderByDescending(b => b.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetByAssemblerIdAsync(int assemblerId)
    {
        return await _dbSet
            .Include(b => b.Customer)
            .Include(b => b.Assembler)
            .ThenInclude(a => a.User)
            .Include(b => b.Service)
            .Where(b => b.AssemblerId == assemblerId && !b.IsDeleted)
            .OrderByDescending(b => b.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Include(b => b.Customer)
            .Include(b => b.Assembler)
            .ThenInclude(a => a.User)
            .Include(b => b.Service)
            .Where(b => b.Date >= startDate && b.Date <= endDate && !b.IsDeleted)
            .OrderBy(b => b.Date)
            .ToListAsync();
    }

    public async Task<bool> IsTimeSlotAvailableAsync(int assemblerId, DateTime date, TimeSpan startTime, TimeSpan endTime)
    {
        var conflictingBooking = await _dbSet
            .Where(b => b.AssemblerId == assemblerId && 
                       b.Date.Date == date.Date &&
                       b.Status != BookingStatus.Cancelled &&
                       !b.IsDeleted &&
                       ((b.StartTime <= startTime && b.EndTime > startTime) ||
                        (b.StartTime < endTime && b.EndTime >= endTime) ||
                        (b.StartTime >= startTime && b.EndTime <= endTime)))
            .FirstOrDefaultAsync();

        return conflictingBooking == null;
    }
}
