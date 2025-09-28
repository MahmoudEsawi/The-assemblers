import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Service } from '../../../../core/models/service.model';
import { Assembler } from '../../../../core/models/assembler.model';
import { Booking } from '../../../../core/models/booking.model';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { AuthService } from '../../../../core/services/auth.service';

interface CalendarDay {
  date: number;
  fullDate: Date;
  isCurrentMonth: boolean;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  service: Service | null = null;
  serviceId: string | null = null;
  assemblerId: string | null = null;
  selectedAssembler: Assembler | null = null;
  assemblers: Assembler[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  // Calendar properties
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  calendarDays: CalendarDay[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  availableTimeSlots: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private mockDataService: MockDataService,
    private authService: AuthService
  ) {
    this.bookingForm = this.fb.group({
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('serviceId');
    this.assemblerId = this.route.snapshot.paramMap.get('assemblerId');
    
    if (this.serviceId) {
      this.service = this.mockDataService.getServiceById(this.serviceId) ?? null;
      this.assemblers = this.mockDataService.getAssemblersByService(this.serviceId);
      this.generateCalendar();
    } else {
      this.errorMessage = 'Service not found';
    }
  }

  selectAssembler(assemblerId: string): void {
    this.assemblerId = assemblerId;
    this.selectedAssembler = this.assemblers.find(a => a.id === assemblerId) || null;
    this.selectedDate = null;
    this.selectedTime = null;
    this.generateCalendar();
  }

  generateCalendar(): void {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      this.calendarDays.push({
        date: date.getDate(),
        fullDate: new Date(date),
        isCurrentMonth: date.getMonth() === this.currentMonth
      });
    }
  }

  previousMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  getCurrentMonthYear(): string {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[this.currentMonth]} ${this.currentYear}`;
  }

  isDayAvailable(day: CalendarDay): boolean {
    if (!this.selectedAssembler?.availability) return true;
    
    const dayOfWeek = day.fullDate.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek] as keyof typeof this.selectedAssembler.availability;
    
    const availability = this.selectedAssembler.availability[dayName];
    return availability.available && day.isCurrentMonth;
  }

  isDaySelected(day: CalendarDay): boolean {
    return this.selectedDate?.getTime() === day.fullDate.getTime();
  }

  isToday(day: CalendarDay): boolean {
    const today = new Date();
    return day.fullDate.toDateString() === today.toDateString();
  }

  selectDate(day: CalendarDay): void {
    if (!this.isDayAvailable(day)) return;
    
    this.selectedDate = day.fullDate;
    this.selectedTime = null;
    this.generateTimeSlots();
  }

  generateTimeSlots(): void {
    if (!this.selectedAssembler?.availability || !this.selectedDate) return;
    
    const dayOfWeek = this.selectedDate.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek] as keyof typeof this.selectedAssembler.availability;
    
    const availability = this.selectedAssembler.availability[dayName];
    if (!availability.available) return;
    
    const slots: string[] = [];
    const startHour = parseInt(availability.start.split(':')[0]);
    const endHour = parseInt(availability.end.split(':')[0]);
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    this.availableTimeSlots = slots;
  }

  selectTime(time: string): void {
    this.selectedTime = time;
  }

  isAssemblerAvailable(assemblerId: string): boolean {
    const assembler = this.assemblers.find(a => a.id === assemblerId);
    if (!assembler?.availability) return true;
    
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek] as keyof typeof assembler.availability;
    
    return assembler.availability[dayName].available;
  }

  onSubmit(): void {
    if (this.bookingForm.invalid || !this.serviceId || !this.authService.currentUser || !this.selectedDate || !this.selectedTime) {
      return;
    }

    const bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'> = {
      serviceId: this.serviceId,
      assemblerId: this.assemblerId || this.assemblers[0]?.id,
      customerId: this.authService.currentUser!.id,
      date: new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate(), 
        parseInt(this.selectedTime!.split(':')[0]), parseInt(this.selectedTime!.split(':')[1])),
      status: 'pending' as Booking['status'],
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