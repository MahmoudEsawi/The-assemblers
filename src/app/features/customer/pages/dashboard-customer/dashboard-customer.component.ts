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
import { RatingModalComponent } from '../../../../shared/components/rating-modal/rating-modal.component';
import { ReviewService } from '../../../../core/services/review.service';

@Component({
  selector: 'app-dashboard-customer',
  standalone: true,
  imports: [CommonModule, BookingDetailsComponent, RatingModalComponent],
  templateUrl: './dashboard-customer.component.html',
  styleUrls: ['./dashboard-customer.component.scss']
})
export class DashboardCustomerComponent implements OnInit {
  bookings: Booking[] = [];
  user: any;
  selectedFilter: string = 'all';
  filteredBookings: Booking[] = [];
  services: Service[] = [];
  assemblers: Assembler[] = [];
  
  // Modal state
  selectedBooking: Booking | null = null;
  selectedService: Service | null = null;
  selectedAssembler: Assembler | null = null;
  showBookingDetails = false;
  showRatingModal = false;
  ratingBookingId: number | null = null;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private serviceService: ServiceService,
    private assemblerService: AssemblerService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    this.loadBookings();
    this.loadServices();
    this.loadAssemblers();
    this.filteredBookings = this.bookings;
  }

  loadBookings(): void {
    if (!this.user?.id) return;
    
    // Load ALL bookings for customer (not just confirmed)
    this.bookingService.getBookingsByCustomer(this.user.id).subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.filteredBookings = this.bookings;
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
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

  getCompletedBookings(): number {
    return this.bookings.filter(booking => booking.status === BookingStatus.Completed).length;
  }

  // Service methods
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

  cancelBooking(bookingId: number): void {
    // Implement booking cancellation
    console.log('Cancel booking:', bookingId);
    this.closeBookingDetails();
  }

  rateBooking(bookingId: number): void {
    this.ratingBookingId = bookingId;
    this.showRatingModal = true;
  }

  closeRatingModal(): void {
    this.showRatingModal = false;
    this.ratingBookingId = null;
  }

  submitRating(ratingData: {rating: number, comment: string}): void {
    if (!this.ratingBookingId || !this.user?.id) return;

    const booking = this.bookings.find(b => b.id === this.ratingBookingId);
    if (!booking) return;

    const reviewData = {
      customerId: this.user.id,
      assemblerId: booking.assemblerId,
      bookingId: this.ratingBookingId,
      rating: ratingData.rating,
      comment: ratingData.comment
    };

    this.reviewService.createReview(reviewData).subscribe({
      next: (review) => {
        console.log('Review created successfully:', review);
        this.closeRatingModal();
        // Optionally refresh bookings to show updated data
        this.loadBookings();
      },
      error: (err) => {
        console.error('Error creating review:', err);
        // Handle error (show notification, etc.)
      }
    });
  }

  getRatingBookingInfo(): {assemblerName: string, serviceName: string} | null {
    if (!this.ratingBookingId) return null;
    
    const booking = this.bookings.find(b => b.id === this.ratingBookingId);
    if (!booking) return null;

    // Get assembler name from assemblers list if user data is not available
    let assemblerName = 'Unknown Assembler';
    if (booking.assembler?.user?.name) {
      assemblerName = booking.assembler.user.name;
    } else if (booking.assembler?.userId) {
      const assemblerProfile = this.assemblers.find(a => a.UserId === booking.assembler!.userId);
      if (assemblerProfile?.User?.Name) {
        assemblerName = assemblerProfile.User.Name;
      }
    }

    return {
      assemblerName,
      serviceName: booking.service?.name || 'Unknown Service'
    };
  }
}