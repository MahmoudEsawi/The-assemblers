import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CategoryService } from './core/services/category.service';
import { AuthService } from './core/services/auth.service';
import { ServiceService } from './core/services/service.service';
import { AssemblerService } from './core/services/assembler.service';
import { BookingService } from './core/services/booking.service';
import { ReviewService } from './core/services/review.service';
import { ChatService } from './core/services/chat.service';
import { RealtimeService } from './core/services/realtime.service';
import { LocationService } from './core/services/location.service';
import { ImageUploadService } from './core/services/image-upload.service';
import { NotificationService } from './core/services/notification.service';
import { SeoService } from './core/services/seo.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideAnimations(),
    CategoryService,
    AuthService,
    ServiceService,
    AssemblerService,
    BookingService,
    ReviewService,
    ChatService,
    RealtimeService,
    LocationService,
    ImageUploadService,
    NotificationService,
    SeoService
  ]
};