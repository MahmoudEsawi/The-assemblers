import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Assembler } from '../../../../core/models/assembler.model';
import { Service } from '../../../../core/models/service.model';
import { Review } from '../../../../core/models/review.model';
import { AssemblerService } from '../../../../core/services/assembler.service';
import { ServiceService } from '../../../../core/services/service.service';
import { ReviewService } from '../../../../core/services/review.service';

interface CalendarDay {
  date: number;
  fullDate: Date;
  isCurrentMonth: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  assembler: Assembler | null = null;
  assemblerId: number | null = null;
  reviews: Review[] = [];
  services: Service[] = [];

  // Calendar properties
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  calendarDays: CalendarDay[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assemblerService: AssemblerService,
    private serviceService: ServiceService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    const assemblerIdParam = this.route.snapshot.paramMap.get('id');
    this.assemblerId = assemblerIdParam ? parseInt(assemblerIdParam, 10) : null;
    
    if (this.assemblerId) {
      this.assemblerService.getAssemblerById(this.assemblerId).subscribe({
        next: (assembler) => {
          this.assembler = assembler;
          this.generateCalendar();
        },
        error: (err) => {
          console.error('Error loading assembler:', err);
        }
      });

      this.reviewService.getReviewsByAssembler(this.assemblerId).subscribe({
        next: (reviews) => {
          this.reviews = reviews;
        },
        error: (err) => {
          console.error('Error loading reviews:', err);
        }
      });

      this.serviceService.getServices().subscribe({
        next: (services) => {
          this.services = services.filter(service => service.AssemblerId === this.assemblerId);
        },
        error: (err) => {
          console.error('Error loading services:', err);
        }
      });
    }
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
    if (!this.assembler?.Availability) return true;
    
    const dayOfWeek = day.fullDate.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];
    
    const dayAvailability = this.assembler.Availability.find(da => 
      da.DayOfWeek === dayOfWeek
    );
    
    return dayAvailability ? dayAvailability.Available && day.isCurrentMonth : true;
  }

  isToday(day: CalendarDay): boolean {
    const today = new Date();
    return day.fullDate.toDateString() === today.toDateString();
  }

  isCurrentlyAvailable(): boolean {
    if (!this.assembler?.Availability) return true;
    
    const now = new Date();
    const dayOfWeek = now.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];
    
    const dayAvailability = this.assembler.Availability.find(da => 
      da.DayOfWeek === dayOfWeek
    );
    
    if (!dayAvailability || !dayAvailability.Available) return false;
    
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const startTime = parseInt(dayAvailability.Start.replace(':', ''));
    const endTime = parseInt(dayAvailability.End.replace(':', ''));
    
    return currentTime >= startTime && currentTime <= endTime;
  }

  getAveragePrice(): number {
    if (this.services.length === 0) return 0;
    const total = this.services.reduce((sum, service) => sum + service.Price, 0);
    return Math.round(total / this.services.length);
  }

  bookService(): void {
    if (this.services.length > 0) {
      this.router.navigate(['/booking', this.services[0].Id, this.assembler?.Id]);
    }
  }

  contactAssembler(): void {
    // In a real app, this would open a contact form or messaging system
    alert(`Contact ${this.assembler?.User?.Name || 'Unknown'} at ${this.assembler?.User?.Phone || 'N/A'} or ${this.assembler?.User?.Email || 'N/A'}`);
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '<i class="fas fa-star"></i>'.repeat(fullStars) + 
           (halfStar ? '<i class="fas fa-star-half-alt"></i>' : '') + 
           '<i class="far fa-star"></i>'.repeat(emptyStars);
  }
}