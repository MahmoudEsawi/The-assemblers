import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking } from '../../../../core/models/booking.model';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-assembler',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-assembler.component.html',
  styleUrls: ['./dashboard-assembler.component.scss']
})
export class DashboardAssemblerComponent implements OnInit {
  bookings: Booking[] = [];
  user: any;
  selectedFilter: string = 'all';
  filteredBookings: Booking[] = [];
  isAvailable: boolean = true;

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
    this.bookings = allBookings.filter(booking => booking.assemblerId === this.user.id);
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

  getInProgressBookings(): number {
    return this.bookings.filter(booking => booking.status === 'in-progress').length;
  }

  getCompletedBookings(): number {
    return this.bookings.filter(booking => booking.status === 'completed').length;
  }

  // Customer methods
  getCustomerName(customerId: string): string {
    const customer = this.mockDataService.getUserById(customerId);
    return customer ? customer.name : 'Unknown Customer';
  }

  getCustomerImage(customerId: string): string {
    const customer = this.mockDataService.getUserById(customerId);
    return customer ? customer.profileImage : 'assets/default-avatar.png';
  }

  getCustomerLocation(customerId: string): string {
    const customer = this.mockDataService.getUserById(customerId);
    return customer ? customer.address : 'Location not specified';
  }

  getCustomerRating(customerId: string): string {
    // For now, return a default rating
    return '4.5';
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

  getServicePrice(serviceId: string): string {
    const service = this.mockDataService.getServiceById(serviceId);
    return service ? service.price.toString() : '0';
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

  viewBookingDetails(bookingId: string): void {
    // Implement booking details modal or navigation
    console.log('View booking details:', bookingId);
  }

  updateBookingStatus(bookingId: string, status: string): void {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = status as any;
      // In a real app, this would call a service to update the booking
      this.setFilter(this.selectedFilter); // Refresh filtered bookings
    }
  }
}