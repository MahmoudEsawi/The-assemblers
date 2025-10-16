using AssemblersApi.Application.DTOs;
using AssemblersApi.Application.Interfaces;
using AssemblersApi.Domain.Interfaces;
using AssemblersApi.Domain.Entities;
using AssemblersApi.Domain.Enums;

namespace AssemblersApi.Application.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IUserRepository _userRepository;
    private readonly IAssemblerRepository _assemblerRepository;
    private readonly IServiceRepository _serviceRepository;

    public BookingService(
        IBookingRepository bookingRepository,
        IUserRepository userRepository,
        IAssemblerRepository assemblerRepository,
        IServiceRepository serviceRepository)
    {
        _bookingRepository = bookingRepository;
        _userRepository = userRepository;
        _assemblerRepository = assemblerRepository;
        _serviceRepository = serviceRepository;
    }

    public async Task<BookingDto?> GetByIdAsync(int id)
    {
        var booking = await _bookingRepository.GetByIdAsync(id);
        return booking != null ? await MapToDtoAsync(booking) : null;
    }

    public async Task<IEnumerable<BookingDto>> GetAllAsync()
    {
        var bookings = await _bookingRepository.GetAllAsync();
        var bookingDtos = new List<BookingDto>();
        
        foreach (var booking in bookings)
        {
            bookingDtos.Add(await MapToDtoAsync(booking));
        }
        
        return bookingDtos;
    }

    public async Task<BookingDto> CreateAsync(CreateBookingDto createBookingDto)
    {
        // Check if time slot is available
        if (!await _bookingRepository.IsTimeSlotAvailableAsync(
            createBookingDto.AssemblerId, 
            createBookingDto.Date, 
            createBookingDto.StartTime, 
            createBookingDto.EndTime))
        {
            throw new InvalidOperationException("Time slot is not available");
        }

        // Get service to calculate total price
        var service = await _serviceRepository.GetByIdAsync(createBookingDto.ServiceId);
        if (service == null)
        {
            throw new InvalidOperationException("Service not found");
        }

        var duration = createBookingDto.EndTime - createBookingDto.StartTime;
        var totalPrice = service.Price * (decimal)duration.TotalHours;

        var booking = new Booking
        {
            CustomerId = createBookingDto.CustomerId,
            AssemblerId = createBookingDto.AssemblerId,
            ServiceId = createBookingDto.ServiceId,
            Date = createBookingDto.Date,
            StartTime = createBookingDto.StartTime,
            EndTime = createBookingDto.EndTime,
            Notes = createBookingDto.Notes,
            Status = BookingStatus.Pending,
            TotalPrice = totalPrice
        };

        var createdBooking = await _bookingRepository.AddAsync(booking);
        return await MapToDtoAsync(createdBooking);
    }

    public async Task<BookingDto> UpdateStatusAsync(int id, UpdateBookingStatusDto updateDto)
    {
        var booking = await _bookingRepository.GetByIdAsync(id);
        if (booking == null)
        {
            throw new InvalidOperationException("Booking not found");
        }

        booking.Status = updateDto.Status;
        await _bookingRepository.UpdateAsync(booking);
        
        return await MapToDtoAsync(booking);
    }

    public async Task<IEnumerable<BookingDto>> GetByCustomerIdAsync(int customerId)
    {
        var bookings = await _bookingRepository.GetByCustomerIdAsync(customerId);
        var bookingDtos = new List<BookingDto>();
        
        foreach (var booking in bookings)
        {
            bookingDtos.Add(await MapToDtoAsync(booking));
        }
        
        return bookingDtos;
    }

    public async Task<IEnumerable<BookingDto>> GetByAssemblerIdAsync(int assemblerId)
    {
        var bookings = await _bookingRepository.GetByAssemblerIdAsync(assemblerId);
        var bookingDtos = new List<BookingDto>();
        
        foreach (var booking in bookings)
        {
            bookingDtos.Add(await MapToDtoAsync(booking));
        }
        
        return bookingDtos;
    }

    public async Task UpdateAsync(int id, UpdateBookingDto updateBookingDto)
    {
        var booking = await _bookingRepository.GetByIdAsync(id);
        if (booking == null)
        {
            throw new InvalidOperationException($"Booking with ID {id} not found");
        }

        // Update only provided fields
        if (updateBookingDto.Date.HasValue)
            booking.Date = updateBookingDto.Date.Value;
        
        if (updateBookingDto.StartTime.HasValue)
            booking.StartTime = updateBookingDto.StartTime.Value;
        
        if (updateBookingDto.EndTime.HasValue)
            booking.EndTime = updateBookingDto.EndTime.Value;
        
        if (!string.IsNullOrEmpty(updateBookingDto.Notes))
            booking.Notes = updateBookingDto.Notes;
        
        if (updateBookingDto.Status.HasValue)
            booking.Status = updateBookingDto.Status.Value;

        await _bookingRepository.UpdateAsync(booking);
    }

    public async Task DeleteAsync(int id)
    {
        await _bookingRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<BookingDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        var bookings = await _bookingRepository.GetByDateRangeAsync(startDate, endDate);
        var bookingDtos = new List<BookingDto>();
        
        foreach (var booking in bookings)
        {
            bookingDtos.Add(await MapToDtoAsync(booking));
        }
        
        return bookingDtos;
    }

    public async Task<bool> IsTimeSlotAvailableAsync(int assemblerId, DateTime date, TimeSpan startTime, TimeSpan endTime)
    {
        return await _bookingRepository.IsTimeSlotAvailableAsync(assemblerId, date, startTime, endTime);
    }

    private async Task<BookingDto> MapToDtoAsync(Booking booking)
    {
        var customer = await _userRepository.GetByIdAsync(booking.CustomerId);
        var assembler = await _assemblerRepository.GetByIdAsync(booking.AssemblerId);
        var service = await _serviceRepository.GetByIdAsync(booking.ServiceId);
        
        return new BookingDto
        {
            Id = booking.Id,
            CustomerId = booking.CustomerId,
            AssemblerId = booking.AssemblerId,
            ServiceId = booking.ServiceId,
            Customer = customer != null ? new UserDto
            {
                Id = customer.Id,
                Name = customer.Name,
                Email = customer.Email,
                Phone = customer.Phone,
                Address = customer.Address,
                ProfileImage = customer.ProfileImage,
                Role = customer.Role,
                CreatedAt = customer.CreatedAt
            } : null!,
            Assembler = assembler != null ? new AssemblerDto
            {
                Id = assembler.Id,
                UserId = assembler.UserId,
                Specialization = assembler.Specialization,
                Description = assembler.Description,
                Location = assembler.Location,
                CoverImage = assembler.CoverImage,
                AverageRating = assembler.AverageRating,
                IsVerified = assembler.IsVerified,
                CreatedAt = assembler.CreatedAt
            } : null!,
            Service = service != null ? new ServiceDto
            {
                Id = service.Id,
                CategoryId = service.CategoryId,
                AssemblerId = service.AssemblerId,
                Name = service.Name,
                Description = service.Description,
                Price = service.Price,
                ImageUrl = service.ImageUrl,
                AverageRating = service.AverageRating,
                ReviewCount = service.ReviewCount,
                CreatedAt = service.CreatedAt
            } : null!,
            Date = booking.Date,
            StartTime = booking.StartTime,
            EndTime = booking.EndTime,
            Notes = booking.Notes,
            Status = booking.Status,
            TotalPrice = booking.TotalPrice,
            CreatedAt = booking.CreatedAt
        };
    }
}
