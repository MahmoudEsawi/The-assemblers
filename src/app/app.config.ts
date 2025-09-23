import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CategoryService } from './core/services/category.service';
import { MockDataService } from './core/services/mock-data.service';
import { AuthService } from './core/services/auth.service';
import { ServiceService } from './core/services/service.service';
import { AssemblerService } from './core/services/assembler.service';
import { BookingService } from './core/services/booking.service';
import { ReviewService } from './core/services/review.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideAnimations(),
    CategoryService,
    MockDataService,
    AuthService,
    ServiceService,
    AssemblerService,
    BookingService,
    ReviewService
  ]
};