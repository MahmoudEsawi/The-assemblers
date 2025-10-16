import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking, BookingStatus } from '../../../../core/models/booking.model';
import { Service } from '../../../../core/models/service.model';
import { Assembler } from '../../../../core/models/assembler.model';
import { BookingService } from '../../../../core/services/booking.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ServiceService } from '../../../../core/services/service.service';
import { AssemblerService } from '../../../../core/services/assembler.service';
import { BookingDetailsComponent } from '../../../../shared/components/booking-details/booking-details.component';

@Component({
  selector: 'app-dashboard-assembler',
  standalone: true,
  imports: [CommonModule, BookingDetailsComponent],
  templateUrl: './dashboard-assembler.component.html',
  styleUrls: ['./dashboard-assembler.component.scss']
})
export class DashboardAssemblerComponent implements OnInit {
  bookings: Booking[] = [];
  user: any;
  selectedFilter: string = 'all';
  filteredBookings: Booking[] = [];
  isAvailable: boolean = true;
  services: Service[] = [];
  assemblers: Assembler[] = [];
  
  // Modal state
  selectedBooking: Booking | null = null;
  selectedService: Service | null = null;
  selectedAssembler: Assembler | null = null;
  showBookingDetails = false;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private serviceService: ServiceService,
    private assemblerService: AssemblerService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    this.loadServices();
    // Load assemblers and then bookings
    this.loadAssemblersAndBookings();
    this.filteredBookings = this.bookings;
  }

  loadAssemblersAndBookings(): void {
    this.assemblerService.getAssemblers().subscribe({
      next: (assemblers) => {
        this.assemblers = assemblers;
        // Now load bookings after assemblers are available
        this.loadBookings();
      },
      error: (err) => {
        console.error('Error loading assemblers:', err);
      }
    });
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (err) => {
        console.error('Error loading services:', err);
      }
    });
  }

  loadAssemblers(): void {
    this.assemblerService.getAssemblers().subscribe({
      next: (assemblers) => {
        this.assemblers = assemblers;
      },
      error: (err) => {
        console.error('Error loading assemblers:', err);
      }
    });
  }

  loadBookings(): void {
    if (!this.user?.id) return;
    
    // Find the assembler profile for this user
      const assemblerProfile = this.assemblers.find(a => a.UserId === this.user.id);
    if (!assemblerProfile) {
      console.error('No assembler profile found for user:', this.user.id);
      return;
    }
    
    // Use the actual assembler ID (not user ID)
      this.bookingService.getBookingsByAssembler(assemblerProfile.Id).subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.filteredBookings = this.bookings;
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
      }
    });
  }

  getStatusClass(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.Pending:
        return 'status-pending';
      case BookingStatus.Confirmed:
        return 'status-confirmed';
      case BookingStatus.InProgress:
        return 'status-in-progress';
      case BookingStatus.Completed:
        return 'status-completed';
      case BookingStatus.Cancelled:
        return 'status-cancelled';
      case BookingStatus.Rejected:
        return 'status-rejected';
      default:
        return '';
    }
  }

  getStatusText(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.Pending:
        return 'Pending';
      case BookingStatus.Confirmed:
        return 'Confirmed';
      case BookingStatus.InProgress:
        return 'In Progress';
      case BookingStatus.Completed:
        return 'Completed';
      case BookingStatus.Cancelled:
        return 'Cancelled';
      case BookingStatus.Rejected:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  // Filter methods
  setFilter(filter: string): void {
    this.selectedFilter = filter;
    if (filter === 'all') {
      this.filteredBookings = this.bookings;
    } else {
      // Convert string filter to enum value
      const statusFilter = this.getStatusFromString(filter);
      this.filteredBookings = this.bookings.filter(booking => booking.status === statusFilter);
    }
  }

  private getStatusFromString(statusString: string): BookingStatus {
    switch (statusString) {
      case 'pending': return BookingStatus.Pending;
      case 'confirmed': return BookingStatus.Confirmed;
      case 'in-progress': return BookingStatus.InProgress;
      case 'completed': return BookingStatus.Completed;
      case 'cancelled': return BookingStatus.Cancelled;
      case 'rejected': return BookingStatus.Rejected;
      default: return BookingStatus.Pending;
    }
  }

  getPendingBookings(): number {
    return this.bookings.filter(booking => booking.status === BookingStatus.Pending).length;
  }

  getConfirmedBookings(): number {
    return this.bookings.filter(booking => booking.status === BookingStatus.Confirmed).length;
  }

  getInProgressBookings(): number {
    return this.bookings.filter(booking => booking.status === BookingStatus.InProgress).length;
  }

  getCompletedBookings(): number {
    return this.bookings.filter(booking => booking.status === BookingStatus.Completed).length;
  }
  getServiceName(serviceId: number): string {
    const service = this.services.find(s => s.Id === serviceId);
    return service?.Name || `Service ${serviceId}`;
  }

  getServiceDescription(serviceId: number): string {
    const service = this.services.find(s => s.Id === serviceId);
    return service?.Description || 'No description available';
  }

  // Assembler methods
  getAssemblerName(assemblerId: number): string {
    const assembler = this.assemblers.find(a => a.Id === assemblerId);
    return assembler?.User?.Name || `Assembler ${assemblerId}`;
  }

  getAssemblerImage(assemblerId: number): string {
    const assembler = this.assemblers.find(a => a.Id === assemblerId);
    return assembler?.User?.ProfileImage || 'assets/default-avatar.png';
  }

  getAssemblerSpecialization(assemblerId: number): string {
    const assembler = this.assemblers.find(a => a.Id === assemblerId);
    return assembler?.Specialization || 'General Services';
  }

  getAssemblerRating(assemblerId: number): string {
    const assembler = this.assemblers.find(a => a.Id === assemblerId);
    return assembler?.AverageRating?.toString() || '4.5';
  }

  // Action methods
  refreshBookings(): void {
    this.loadBookings();
    this.setFilter(this.selectedFilter);
  }

  toggleAvailability(): void {
    this.isAvailable = !this.isAvailable;
    // Here you would update the assembler's availability status
    console.log('Availability toggled:', this.isAvailable);
  }

  viewBookingDetails(bookingId: number): void {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      this.selectedBooking = booking;
      this.selectedService = this.services.find(s => s.Id === booking.serviceId) || null;
      this.selectedAssembler = this.assemblers.find(a => a.Id === booking.assemblerId) || null;
      this.showBookingDetails = true;
    }
  }

  closeBookingDetails(): void {
    this.showBookingDetails = false;
    this.selectedBooking = null;
    this.selectedService = null;
    this.selectedAssembler = null;
  }

  rateBooking(bookingId: number): void {
    // Implement rating modal
    console.log('Rate booking:', bookingId);
    this.closeBookingDetails();
  }

  updateBookingStatus(bookingId: number, status: BookingStatus): void {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = status;
      // In a real app, this would call a service to update the booking
      this.setFilter(this.selectedFilter); // Refresh filtered bookings
    }
  }

  // Booking confirmation methods
  confirmBooking(bookingId: number): void {
    this.bookingService.confirmBooking(bookingId).subscribe({
      next: (updatedBooking) => {
        const index = this.bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
          this.bookings[index] = updatedBooking;
          this.setFilter(this.selectedFilter);
        }
        console.log('Booking confirmed:', updatedBooking);
      },
      error: (err) => {
        console.error('Error confirming booking:', err);
      }
    });
  }

  rejectBooking(bookingId: number): void {
    this.bookingService.rejectBooking(bookingId).subscribe({
      next: (updatedBooking) => {
        const index = this.bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
          this.bookings[index] = updatedBooking;
          this.setFilter(this.selectedFilter);
        }
        console.log('Booking rejected:', updatedBooking);
      },
      error: (err) => {
        console.error('Error rejecting booking:', err);
      }
    });
  }

  startBooking(bookingId: number): void {
    this.bookingService.startBooking(bookingId).subscribe({
      next: (updatedBooking) => {
        const index = this.bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
          this.bookings[index] = updatedBooking;
          this.setFilter(this.selectedFilter);
        }
        console.log('Booking started:', updatedBooking);
      },
      error: (err) => {
        console.error('Error starting booking:', err);
      }
    });
  }

  completeBooking(bookingId: number): void {
    this.bookingService.completeBooking(bookingId).subscribe({
      next: (updatedBooking) => {
        const index = this.bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
          this.bookings[index] = updatedBooking;
          this.setFilter(this.selectedFilter);
        }
        console.log('Booking completed:', updatedBooking);
      },
      error: (err) => {
        console.error('Error completing booking:', err);
      }
    });
  }
}