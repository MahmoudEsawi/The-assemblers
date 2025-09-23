import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Booking } from '../models/booking.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private mockDataService: MockDataService) {}

  getBookings(): Observable<Booking[]> {
    return of(this.mockDataService.getBookings()).pipe(delay(300));
  }

  getBookingById(id: string): Observable<Booking | undefined> {
    return of(this.mockDataService.getBookingById(id)).pipe(delay(300));
  }

  createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Observable<Booking> {
    return this.mockDataService.createBooking(bookingData);
  }
}