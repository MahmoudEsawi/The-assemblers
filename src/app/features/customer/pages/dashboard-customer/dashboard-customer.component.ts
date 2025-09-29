import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking } from '../../../../core/models/booking.model';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-customer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-customer.component.html',
  styleUrls: ['./dashboard-customer.component.scss']
})
export class DashboardCustomerComponent implements OnInit {
  bookings: Booking[] = [];
  user: any;
  selectedFilter: string = 'all';
  filteredBookings: Booking[] = [];

  constructor(
    private mockDataService: MockDataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    this.loadBookings();
    this.filteredBookings = this.bookings;
  }

  loadBookings(): void {
    const allBookings = this.mockDataService.getBookings();
    this.bookings = allBookings.filter(booking => booking.customerId === this.user.id);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'in-progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  // Filter methods
  setFilter(filter: string): void {
    this.selectedFilter = filter;
    if (filter === 'all') {
      this.filteredBookings = this.bookings;
    } else {
      this.filteredBookings = this.bookings.filter(booking => booking.status === filter);
    }
  }

  getPendingBookings(): number {
    return this.bookings.filter(booking => booking.status === 'pending').length;
  }

  getConfirmedBookings(): number {
    return this.bookings.filter(booking => booking.status === 'confirmed').length;
  }

  getCompletedBookings(): number {
    return this.bookings.filter(booking => booking.status === 'completed').length;
  }

  // Service methods
  getServiceName(serviceId: string): string {
    const service = this.mockDataService.getServiceById(serviceId);
    return service ? service.name : 'Unknown Service';
  }

  getServiceDescription(serviceId: string): string {
    const service = this.mockDataService.getServiceById(serviceId);
    return service ? service.description : 'No description available';
  }

  // Assembler methods
  getAssemblerName(assemblerId: string): string {
    const assembler = this.mockDataService.getAssemblerById(assemblerId);
    return assembler ? assembler.name : 'Unknown Assembler';
  }

  getAssemblerImage(assemblerId: string): string {
    const assembler = this.mockDataService.getAssemblerById(assemblerId);
    return assembler ? assembler.profileImage : 'assets/default-avatar.png';
  }

  getAssemblerSpecialization(assemblerId: string): string {
    const assembler = this.mockDataService.getAssemblerById(assemblerId);
    return assembler ? assembler.specialization : 'General Services';
  }

  getAssemblerRating(assemblerId: string): string {
    const assembler = this.mockDataService.getAssemblerById(assemblerId);
    if (!assembler) return '0';
    
    const fullStars = Math.floor(assembler.averageRating);
    const halfStar = assembler.averageRating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
  }

  // Action methods
  refreshBookings(): void {
    this.loadBookings();
    this.setFilter(this.selectedFilter);
  }

  viewBookingDetails(bookingId: string): void {
    // Implement booking details modal or navigation
    console.log('View booking details:', bookingId);
  }

  cancelBooking(bookingId: string): void {
    // Implement booking cancellation
    console.log('Cancel booking:', bookingId);
  }

  rateBooking(bookingId: string): void {
    // Implement rating modal
    console.log('Rate booking:', bookingId);
  }
}