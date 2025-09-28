import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Assembler } from '../../../../core/models/assembler.model';
import { Service } from '../../../../core/models/service.model';
import { Review } from '../../../../core/models/review.model';
import { MockDataService } from '../../../../core/services/mock-data.service';

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
  assemblerId: string | null = null;
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
    private mockDataService: MockDataService
  ) {}

  ngOnInit(): void {
    this.assemblerId = this.route.snapshot.paramMap.get('id');
    
    if (this.assemblerId) {
      this.assembler = this.mockDataService.getAssemblerById(this.assemblerId) ?? null;
      this.reviews = this.mockDataService.getReviewsByAssembler(this.assemblerId);
      this.services = this.mockDataService.getServices().filter(service => service.assemblerId === this.assemblerId);
      this.generateCalendar();
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
    if (!this.assembler?.availability) return true;
    
    const dayOfWeek = day.fullDate.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek] as keyof typeof this.assembler.availability;
    
    const availability = this.assembler.availability[dayName];
    return availability.available && day.isCurrentMonth;
  }

  isToday(day: CalendarDay): boolean {
    const today = new Date();
    return day.fullDate.toDateString() === today.toDateString();
  }

  isCurrentlyAvailable(): boolean {
    if (!this.assembler?.availability) return true;
    
    const now = new Date();
    const dayOfWeek = now.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek] as keyof typeof this.assembler.availability;
    
    const availability = this.assembler.availability[dayName];
    if (!availability.available) return false;
    
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const startTime = parseInt(availability.start.replace(':', ''));
    const endTime = parseInt(availability.end.replace(':', ''));
    
    return currentTime >= startTime && currentTime <= endTime;
  }

  getAveragePrice(): number {
    if (this.services.length === 0) return 0;
    const total = this.services.reduce((sum, service) => sum + service.price, 0);
    return Math.round(total / this.services.length);
  }

  bookService(): void {
    if (this.services.length > 0) {
      this.router.navigate(['/booking', this.services[0].id, this.assembler?.id]);
    }
  }

  contactAssembler(): void {
    // In a real app, this would open a contact form or messaging system
    alert(`Contact ${this.assembler?.name} at ${this.assembler?.phone} or ${this.assembler?.email}`);
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
  }
}