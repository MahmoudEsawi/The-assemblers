import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Booking, BookingStatus } from '../../../core/models/booking.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent {
  @Input() assemblerId!: number;
  @Input() serviceId!: number;
  @Input() customerId!: number;
  @Output() submitBooking = new EventEmitter<Booking>();
  @Output() cancel = new EventEmitter<void>();
  
  bookingForm: FormGroup;
  minDate = new Date().toISOString().split('T')[0];
  
  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      date: ['', Validators.required],
      notes: ['']
    });
  }
  
  onSubmit(): void {
    if (this.bookingForm.valid) {
      const booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'> = {
        customerId: this.customerId,
        assemblerId: this.assemblerId,
        serviceId: this.serviceId,
        date: new Date(this.bookingForm.value.date).toISOString().split('T')[0],
        startTime: '09:00:00', // Default start time
        endTime: '10:00:00', // Default end time (1 hour duration)
        status: BookingStatus.Pending,
        notes: this.bookingForm.value.notes,
        totalPrice: 0 // Will be set by the parent component
      };
      
      this.submitBooking.emit(booking as Booking);
    }
  }
  
  onCancel(): void {
    this.cancel.emit();
  }
}