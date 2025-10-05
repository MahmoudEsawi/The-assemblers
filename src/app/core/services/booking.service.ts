import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingStatus } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:5161/api';

  constructor(private http: HttpClient) {}

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings`);
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/bookings/${id}`);
  }

  createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/bookings`, bookingData);
  }

  updateBooking(id: number, booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/bookings/${id}`, booking);
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bookings/${id}`);
  }

  getBookingsByCustomer(customerId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/customer/${customerId}`);
  }

  getBookingsByAssembler(assemblerId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/assembler/${assemblerId}`);
  }

  // Assembler booking management methods
  confirmBooking(id: number): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/bookings/${id}/confirm`, {});
  }

  rejectBooking(id: number): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/bookings/${id}/reject`, {});
  }

  startBooking(id: number): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/bookings/${id}/start`, {});
  }

  completeBooking(id: number): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/bookings/${id}/complete`, {});
  }

  getPendingBookingsForAssembler(assemblerId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/assembler/${assemblerId}/pending`);
  }

  getConfirmedBookingsForCustomer(customerId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/customer/${customerId}/confirmed`);
  }

  updateBookingStatus(id: number, status: BookingStatus): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/bookings/${id}/status`, { status });
  }
}