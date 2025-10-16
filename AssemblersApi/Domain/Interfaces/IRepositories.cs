using AssemblersApi.Domain.Entities;

namespace AssemblersApi.Domain.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<bool> EmailExistsAsync(string email);
}

public interface IAssemblerRepository : IRepository<Assembler>
{
    Task<Assembler?> GetByUserIdAsync(int userId);
    Task<IEnumerable<Assembler>> GetBySpecializationAsync(string specialization);
    Task<IEnumerable<Assembler>> GetAvailableAssemblersAsync(DateTime date, TimeSpan startTime, TimeSpan endTime);
}

public interface IServiceRepository : IRepository<Service>
{
    Task<IEnumerable<Service>> GetByCategoryIdAsync(int categoryId);
    Task<IEnumerable<Service>> GetByAssemblerIdAsync(int assemblerId);
    Task<IEnumerable<Service>> SearchAsync(string searchTerm);
}

public interface IBookingRepository : IRepository<Booking>
{
    Task<IEnumerable<Booking>> GetByCustomerIdAsync(int customerId);
    Task<IEnumerable<Booking>> GetByAssemblerIdAsync(int assemblerId);
    Task<IEnumerable<Booking>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<bool> IsTimeSlotAvailableAsync(int assemblerId, DateTime date, TimeSpan startTime, TimeSpan endTime);
}

public interface IReviewRepository : IRepository<Review>
{
    Task<IEnumerable<Review>> GetByAssemblerIdAsync(int assemblerId);
    Task<IEnumerable<Review>> GetByBookingIdAsync(int bookingId);
    Task<decimal> GetAverageRatingAsync(int assemblerId);
}

public interface ICategoryRepository : IRepository<Category> { }
