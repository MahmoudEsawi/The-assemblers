using Microsoft.AspNetCore.Mvc;
using AssemblersApi.Application.DTOs;
using AssemblersApi.Application.Interfaces;
using AssemblersApi.Domain.Enums;

namespace AssemblersApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetBookings()
    {
        var bookings = await _bookingService.GetAllAsync();
        return Ok(bookings);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookingDto>> GetBooking(int id)
    {
        var booking = await _bookingService.GetByIdAsync(id);
        if (booking == null)
        {
            return NotFound();
        }
        return Ok(booking);
    }

    [HttpPost]
    public async Task<ActionResult<BookingDto>> CreateBooking(CreateBookingDto createBookingDto)
    {
        try
        {
            var booking = await _bookingService.CreateAsync(createBookingDto);
            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}/status")]
    public async Task<ActionResult<BookingDto>> UpdateBookingStatus(int id, UpdateBookingStatusDto updateDto)
    {
        try
        {
            var booking = await _bookingService.UpdateStatusAsync(id, updateDto);
            return Ok(booking);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("customer/{customerId}")]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetBookingsByCustomer(int customerId)
    {
        var bookings = await _bookingService.GetByCustomerIdAsync(customerId);
        return Ok(bookings);
    }

    [HttpGet("assembler/{assemblerId}")]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetBookingsByAssembler(int assemblerId)
    {
        var bookings = await _bookingService.GetByAssemblerIdAsync(assemblerId);
        return Ok(bookings);
    }

    [HttpGet("availability")]
    public async Task<ActionResult<bool>> CheckAvailability(
        [FromQuery] int assemblerId,
        [FromQuery] DateTime date,
        [FromQuery] TimeSpan startTime,
        [FromQuery] TimeSpan endTime)
    {
        var isAvailable = await _bookingService.IsTimeSlotAvailableAsync(assemblerId, date, startTime, endTime);
        return Ok(isAvailable);
    }

    [HttpPut("{id}/confirm")]
    public async Task<ActionResult<BookingDto>> ConfirmBooking(int id)
    {
        try
        {
            var updateDto = new UpdateBookingStatusDto { Status = BookingStatus.Confirmed };
            var booking = await _bookingService.UpdateStatusAsync(id, updateDto);
            return Ok(booking);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}/reject")]
    public async Task<ActionResult<BookingDto>> RejectBooking(int id)
    {
        try
        {
            var updateDto = new UpdateBookingStatusDto { Status = BookingStatus.Rejected };
            var booking = await _bookingService.UpdateStatusAsync(id, updateDto);
            return Ok(booking);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}/start")]
    public async Task<ActionResult<BookingDto>> StartBooking(int id)
    {
        try
        {
            var updateDto = new UpdateBookingStatusDto { Status = BookingStatus.InProgress };
            var booking = await _bookingService.UpdateStatusAsync(id, updateDto);
            return Ok(booking);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}/complete")]
    public async Task<ActionResult<BookingDto>> CompleteBooking(int id)
    {
        try
        {
            var updateDto = new UpdateBookingStatusDto { Status = BookingStatus.Completed };
            var booking = await _bookingService.UpdateStatusAsync(id, updateDto);
            return Ok(booking);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("assembler/{assemblerId}/pending")]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetPendingBookingsForAssembler(int assemblerId)
    {
        var allBookings = await _bookingService.GetByAssemblerIdAsync(assemblerId);
        var pendingBookings = allBookings.Where(b => b.Status == BookingStatus.Pending);
        return Ok(pendingBookings);
    }

    [HttpGet("customer/{customerId}/confirmed")]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetConfirmedBookingsForCustomer(int customerId)
    {
        var allBookings = await _bookingService.GetByCustomerIdAsync(customerId);
        var confirmedBookings = allBookings.Where(b => b.Status == BookingStatus.Confirmed || b.Status == BookingStatus.InProgress);
        return Ok(confirmedBookings);
    }
}