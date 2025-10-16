import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Service } from '../../../../core/models/service.model';
import { Assembler } from '../../../../core/models/assembler.model';
import { Booking, BookingStatus } from '../../../../core/models/booking.model';
import { ServiceService } from '../../../../core/services/service.service';
import { AssemblerService } from '../../../../core/services/assembler.service';
import { BookingService } from '../../../../core/services/booking.service';
import { AuthService } from '../../../../core/services/auth.service';

interface CalendarDay {
  day: number;
  date: Date;
  enabled: boolean;
  selected: boolean;
  isToday: boolean;
  hasAvailability: boolean;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  service: Service | null = null;
  assemblers: Assembler[] = [];
  selectedAssembler: Assembler | null = null;
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  notes: string = '';
  
  // Booking steps
  currentStep: number = 1;
  
  // Calendar
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  calendarDays: CalendarDay[] = [];
  
  // Time slots
  availableTimeSlots: string[] = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  
  // Form
  bookingForm: FormGroup;
  
  // State
  isSubmitting: boolean = false;
  errorMessage: string = '';
  
  // Route params
  serviceId: number | null = null;
  assemblerId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private assemblerService: AssemblerService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {
    this.bookingForm = this.fb.group({
      notes: ['']
    });
  }

  ngOnInit(): void {
    const serviceIdParam = this.route.snapshot.paramMap.get('serviceId');
    const assemblerIdParam = this.route.snapshot.paramMap.get('assemblerId');
    
    this.serviceId = serviceIdParam ? parseInt(serviceIdParam, 10) : null;
    this.assemblerId = assemblerIdParam ? parseInt(assemblerIdParam, 10) : null;
    
    if (this.serviceId) {
      this.loadService();
      this.loadAssemblers();
    } else {
      this.errorMessage = 'Service not found';
    }
  }

  private loadService(): void {
    if (!this.serviceId) return;
    
    this.serviceService.getServiceById(this.serviceId).subscribe({
      next: (service) => {
        this.service = service;
      },
      error: (err) => {
        console.error('Error loading service:', err);
        this.errorMessage = 'Service not found';
      }
    });
  }

  private loadAssemblers(): void {
    this.assemblerService.getAssemblers().subscribe({
      next: (assemblers) => {
        this.assemblers = assemblers;
        if (this.assemblerId) {
          this.selectedAssembler = this.assemblers.find(a => a.Id === this.assemblerId) || null;
          if (this.selectedAssembler) {
            this.currentStep = 2;
            this.generateCalendar();
          }
        }
      },
      error: (err) => {
        console.error('Error loading assemblers:', err);
      }
    });
  }

  selectAssembler(assemblerId: number): void {
      this.selectedAssembler = this.assemblers.find(a => a.Id === assemblerId) || null;
    this.selectedDate = null;
    this.selectedTime = null;
    this.generateCalendar();
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  generateCalendar(): void {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const today = new Date();
    
    // Get the first day of the week for the first day of the month
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === this.currentMonth;
      const isToday = this.isSameDay(date, today);
      const isPast = date < today && !isToday;
      const hasAvailability = this.selectedAssembler ? this.isAssemblerAvailableOnDate(date) : false;
      
      this.calendarDays.push({
        day: date.getDate(),
        date: new Date(date),
        enabled: isCurrentMonth && !isPast,
        selected: this.selectedDate ? this.isSameDay(date, this.selectedDate) : false,
        isToday: isToday,
        hasAvailability: hasAvailability
      });
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  private isAssemblerAvailableOnDate(date: Date): boolean {
    if (!this.selectedAssembler?.Availability) return true;
    
    const dayOfWeek = date.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];
    
    const dayAvailability = this.selectedAssembler.Availability.find(da => 
      da.DayOfWeek === dayOfWeek
    );
    
    return dayAvailability ? dayAvailability.Available : true;
  }

  selectDate(day: CalendarDay): void {
    if (!day.enabled) return;
    
    // Clear previous selection
    this.calendarDays.forEach(d => d.selected = false);
    
    // Set new selection
    day.selected = true;
    this.selectedDate = day.date;
    this.selectedTime = null;
    
    // Generate available time slots for this date
    this.generateTimeSlots();
  }

  private generateTimeSlots(): void {
    if (!this.selectedDate || !this.selectedAssembler?.Availability) {
      this.availableTimeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
      ];
      return;
    }
    
    const dayOfWeek = this.selectedDate.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];
    
    const dayAvailability = this.selectedAssembler.Availability.find(da => 
      da.DayOfWeek === dayOfWeek
    );
    
    if (dayAvailability && dayAvailability.Available) {
      // Generate time slots based on availability
      const startHour = parseInt(dayAvailability.Start.split(':')[0]);
      const endHour = parseInt(dayAvailability.End.split(':')[0]);
      
      this.availableTimeSlots = [];
      for (let hour = startHour; hour < endHour; hour++) {
        this.availableTimeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      }
    } else {
      this.availableTimeSlots = [];
    }
  }

  selectTime(time: string): void {
    this.selectedTime = time;
  }

  isTimeSlotAvailable(time: string): boolean {
    // For now, all time slots are available
    // In a real app, you'd check against existing bookings
    return true;
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

  getMonthName(month: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
  }

  isAssemblerAvailable(assemblerId: number): boolean {
    const assembler = this.assemblers.find(a => a.Id === assemblerId);
    if (!assembler?.Availability) return true;
    
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];
    
    const dayAvailability = assembler.Availability.find(da => 
      da.DayOfWeek === dayOfWeek
    );
    
    return dayAvailability ? dayAvailability.Available : true;
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '<i class="fas fa-star"></i>'.repeat(fullStars) + 
           (halfStar ? '<i class="fas fa-star-half-alt"></i>' : '') + 
           '<i class="far fa-star"></i>'.repeat(emptyStars);
  }

  submitBooking(): void {
    if (!this.selectedAssembler || !this.serviceId || !this.selectedDate || !this.selectedTime) {
      return;
    }

    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Combine date and time
    const bookingDateTime = new Date(this.selectedDate);
    const [hours, minutes] = this.selectedTime.split(':').map(Number);
    bookingDateTime.setHours(hours, minutes, 0, 0);

    // Calculate end time (assuming 1 hour duration for now)
    const endDateTime = new Date(bookingDateTime);
    endDateTime.setHours(hours + 1, minutes, 0, 0);

    // Get service price
    const servicePrice = this.service?.Price || 0;

    const newBooking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'> = {
      customerId: currentUser.id,
      assemblerId: this.selectedAssembler.Id,
      serviceId: this.serviceId,
      date: bookingDateTime.toISOString().split('T')[0], // Just the date part
      startTime: this.selectedTime + ':00', // Add seconds
      endTime: endDateTime.toTimeString().split(' ')[0], // Format as HH:MM:SS
      status: BookingStatus.Pending,
      notes: this.notes,
      totalPrice: servicePrice
    };

    this.bookingService.createBooking(newBooking).subscribe({
      next: (booking) => {
        this.isSubmitting = false;
        // Show success message
        alert('Booking created successfully!');
        this.router.navigate(['/dashboard-customer']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to create booking. Please try again.';
        console.error('Error creating booking:', err);
      }
    });
  }
}