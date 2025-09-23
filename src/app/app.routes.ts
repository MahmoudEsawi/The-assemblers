import { Routes } from '@angular/router';
import { LandingComponent } from './features/home/pages/landing/landing.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { DashboardCustomerComponent } from './features/customer/pages/dashboard-customer/dashboard-customer.component';
import { DashboardAssemblerComponent } from './features/assembler/pages/dashboard-assembler/dashboard-assembler.component';
import { ProfileComponent } from './features/assembler/pages/profile/profile.component';
import { ServicesComponent } from './features/services/pages/services/services.component';
import { AuthGuard } from './core/guards/auth.guard';
import { BookingComponent } from './features/booking/pages/booking/booking.component';
import { ServiceAssemblersComponent } from './features/services/pages/service-assemblers/service-assemblers.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard-customer', 
    component: DashboardCustomerComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'dashboard-assembler', 
    component: DashboardAssemblerComponent,
    canActivate: [AuthGuard]
  },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'booking/:serviceId/:assemblerId?', component: BookingComponent, canActivate: [AuthGuard] },
  { path: 'service-assemblers/:serviceId', component: ServiceAssemblersComponent },
  { path: '**', redirectTo: '' }
];