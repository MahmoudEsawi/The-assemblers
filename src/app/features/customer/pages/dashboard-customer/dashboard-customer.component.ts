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

  constructor(
    private mockDataService: MockDataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    this.loadBookings();
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
}