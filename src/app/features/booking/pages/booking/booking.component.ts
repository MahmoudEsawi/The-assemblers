import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Service } from '../../../../core/models/service.model';
import { Booking } from '../../../../core/models/booking.model';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  service: Service | null = null;
  serviceId: string | null = null;
  assemblerId: string | null = null;
  assemblers: any[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private mockDataService: MockDataService,
    private authService: AuthService
  ) {
    this.bookingForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('serviceId');
    this.assemblerId = this.route.snapshot.paramMap.get('assemblerId');
    
    if (this.serviceId) {
      this.service = this.mockDataService.getServiceById(this.serviceId) ?? null;
      this.assemblers = this.mockDataService.getAssemblersByService(this.serviceId);
    } else {
      this.errorMessage = 'Service not found';
    }
  }

  onSubmit(): void {
    if (this.bookingForm.invalid || !this.serviceId || !this.authService.currentUser) {
      return;
    }

    const bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'> = {
      serviceId: this.serviceId,
      assemblerId: this.assemblerId || this.assemblers[0]?.id,
      customerId: this.authService.currentUser!.id,
      date: new Date(this.bookingForm.value.date + 'T' + this.bookingForm.value.time),
      status: 'pending',
      notes: this.bookingForm.value.notes
    };

    this.mockDataService.createBooking(bookingData).subscribe({
      next: (booking) => {
        this.successMessage = 'Booking created successfully!';
        this.errorMessage = '';
        // Redirect after a short delay
        setTimeout(() => {
          this.router.navigate(['/dashboard-customer']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to create booking. Please try again.';
        this.successMessage = '';
      }
    });
  }

  selectAssembler(assemblerId: string): void {
    this.assemblerId = assemblerId;
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
  }
}