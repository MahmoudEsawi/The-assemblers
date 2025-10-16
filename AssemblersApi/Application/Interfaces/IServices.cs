using AssemblersApi.Application.DTOs;

namespace AssemblersApi.Application.Interfaces;

public interface IUserService
{
    Task<UserDto?> GetByIdAsync(int id);
    Task<UserDto?> GetByEmailAsync(string email);
    Task<IEnumerable<UserDto>> GetAllAsync();
    Task<UserDto> CreateAsync(CreateUserDto createUserDto);
    Task UpdateAsync(int id, UpdateUserDto updateUserDto);
    Task DeleteAsync(int id);
    Task<UserDto?> LoginAsync(LoginDto loginDto);
    Task<bool> EmailExistsAsync(string email);
}

public interface IAssemblerService
{
    Task<AssemblerDto?> GetByIdAsync(int id);
    Task<IEnumerable<AssemblerDto>> GetAllAsync();
    Task<AssemblerDto> CreateAsync(CreateAssemblerDto createAssemblerDto);
    Task UpdateAsync(int id, UpdateAssemblerDto updateAssemblerDto);
    Task DeleteAsync(int id);
    Task<AssemblerDto?> GetByUserIdAsync(int userId);
    Task<IEnumerable<AssemblerDto>> GetBySpecializationAsync(string specialization);
    Task<IEnumerable<AssemblerDto>> GetAvailableAssemblersAsync(DateTime date, TimeSpan startTime, TimeSpan endTime);
}

public interface IServiceService
{
    Task<ServiceDto?> GetByIdAsync(int id);
    Task<IEnumerable<ServiceDto>> GetAllAsync();
    Task<ServiceDto> CreateAsync(CreateServiceDto createServiceDto);
    Task UpdateAsync(int id, UpdateServiceDto updateServiceDto);
    Task DeleteAsync(int id);
    Task<IEnumerable<ServiceDto>> GetByCategoryIdAsync(int categoryId);
    Task<IEnumerable<ServiceDto>> GetByAssemblerIdAsync(int assemblerId);
    Task<IEnumerable<ServiceDto>> SearchAsync(string searchTerm);
}

public interface IBookingService
{
    Task<BookingDto?> GetByIdAsync(int id);
    Task<IEnumerable<BookingDto>> GetAllAsync();
    Task<BookingDto> CreateAsync(CreateBookingDto createBookingDto);
    Task UpdateAsync(int id, UpdateBookingDto updateBookingDto);
    Task DeleteAsync(int id);
    Task<BookingDto> UpdateStatusAsync(int id, UpdateBookingStatusDto updateDto);
    Task<IEnumerable<BookingDto>> GetByCustomerIdAsync(int customerId);
    Task<IEnumerable<BookingDto>> GetByAssemblerIdAsync(int assemblerId);
    Task<IEnumerable<BookingDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<bool> IsTimeSlotAvailableAsync(int assemblerId, DateTime date, TimeSpan startTime, TimeSpan endTime);
}

public interface IReviewService
{
    Task<ReviewDto?> GetByIdAsync(int id);
    Task<IEnumerable<ReviewDto>> GetAllAsync();
    Task<ReviewDto> CreateAsync(CreateReviewDto createReviewDto);
    Task UpdateAsync(int id, UpdateReviewDto updateReviewDto);
    Task DeleteAsync(int id);
    Task<IEnumerable<ReviewDto>> GetByAssemblerIdAsync(int assemblerId);
    Task<IEnumerable<ReviewDto>> GetByBookingIdAsync(int bookingId);
    Task<decimal> GetAverageRatingAsync(int assemblerId);
}

public interface ICategoryService
{
    Task<CategoryDto?> GetByIdAsync(int id);
    Task<IEnumerable<CategoryDto>> GetAllAsync();
    Task<CategoryDto> CreateAsync(CreateCategoryDto createCategoryDto);
    Task UpdateAsync(int id, UpdateCategoryDto updateCategoryDto);
    Task DeleteAsync(int id);
}