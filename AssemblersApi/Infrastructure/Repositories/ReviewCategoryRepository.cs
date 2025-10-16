using Microsoft.EntityFrameworkCore;
using AssemblersApi.Domain.Entities;
using AssemblersApi.Domain.Interfaces;
using AssemblersApi.Data;

namespace AssemblersApi.Infrastructure.Repositories;

public class ReviewRepository : Repository<Review>, IReviewRepository
{
    public ReviewRepository(AssemblersDbContext context) : base(context) { }

    public async Task<IEnumerable<Review>> GetByAssemblerIdAsync(int assemblerId)
    {
        return await _dbSet
            .Include(r => r.Customer)
            .Include(r => r.Assembler)
            .ThenInclude(a => a.User)
            .Include(r => r.Booking)
            .Where(r => r.AssemblerId == assemblerId && !r.IsDeleted)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Review>> GetByBookingIdAsync(int bookingId)
    {
        return await _dbSet
            .Include(r => r.Customer)
            .Include(r => r.Assembler)
            .ThenInclude(a => a.User)
            .Include(r => r.Booking)
            .Where(r => r.BookingId == bookingId && !r.IsDeleted)
            .ToListAsync();
    }

    public async Task<decimal> GetAverageRatingAsync(int assemblerId)
    {
        var average = await _dbSet
            .Where(r => r.AssemblerId == assemblerId && !r.IsDeleted)
            .AverageAsync(r => (decimal)r.Rating);

        return Math.Round(average, 2);
    }
}

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    public CategoryRepository(AssemblersDbContext context) : base(context) { }
}
