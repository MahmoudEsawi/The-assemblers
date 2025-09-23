import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Booking } from '../../../core/models/booking.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent {
  @Input() assemblerId!: string;
  @Input() serviceId!: string;
  @Input() customerId!: string;
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
        date: new Date(this.bookingForm.value.date),
        status: 'pending',
        notes: this.bookingForm.value.notes
      };
      
      this.submitBooking.emit(booking as Booking);
    }
  }
  
  onCancel(): void {
    this.cancel.emit();
  }
}