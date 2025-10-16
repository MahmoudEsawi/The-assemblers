# Angular Frontend Integration Guide

## 🔗 Connecting Angular Frontend to .NET API

This guide shows how to connect your existing Angular frontend to the new .NET Web API backend.

## 📋 Prerequisites

- Angular frontend running on `http://localhost:4200`
- .NET API running on `http://localhost:5161`
- Both applications should be running simultaneously

## 🔧 Step 1: Update Angular Services

### Update Base URL in Services

Create a new environment configuration or update existing ones:

**src/environments/environment.ts**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5161/api'
};
```

**src/environments/environment.prod.ts**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api'
};
```

### Update Service Files

**src/app/core/services/category.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getCategory(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  updateCategory(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

**src/app/core/services/user.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

**src/app/core/services/assembler.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assembler } from '../models/assembler.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssemblerService {
  private apiUrl = `${environment.apiUrl}/assemblers`;

  constructor(private http: HttpClient) {}

  getAssemblers(): Observable<Assembler[]> {
    return this.http.get<Assembler[]>(this.apiUrl);
  }

  getAssembler(id: string): Observable<Assembler> {
    return this.http.get<Assembler>(`${this.apiUrl}/${id}`);
  }

  getAssemblerByUserId(userId: string): Observable<Assembler> {
    return this.http.get<Assembler>(`${this.apiUrl}/by-user/${userId}`);
  }

  createAssembler(assembler: Assembler): Observable<Assembler> {
    return this.http.post<Assembler>(this.apiUrl, assembler);
  }

  updateAssembler(id: string, assembler: Assembler): Observable<Assembler> {
    return this.http.put<Assembler>(`${this.apiUrl}/${id}`, assembler);
  }

  deleteAssembler(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

**src/app/core/services/service.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../models/service.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }

  getService(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`);
  }

  getServicesByCategory(categoryId: string): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/by-category/${categoryId}`);
  }

  getServicesByAssembler(assemblerId: string): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/by-assembler/${assemblerId}`);
  }

  createService(service: Service): Observable<Service> {
    return this.http.post<Service>(this.apiUrl, service);
  }

  updateService(id: string, service: Service): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

**src/app/core/services/booking.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getBooking(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  getBookingsByCustomer(customerId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/by-customer/${customerId}`);
  }

  getBookingsByAssembler(assemblerId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/by-assembler/${assemblerId}`);
  }

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  updateBooking(id: string, booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}`, booking);
  }

  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

**src/app/core/services/review.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl);
  }

  getReview(id: string): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  getReviewsByAssembler(assemblerId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/by-assembler/${assemblerId}`);
  }

  getReviewsByCustomer(customerId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/by-customer/${customerId}`);
  }

  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }

  updateReview(id: string, review: Review): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}`, review);
  }

  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

## 🔄 Step 2: Update Models (if needed)

Make sure your Angular models match the API response structure. The API returns:

- **GUIDs** as strings (e.g., "11111111-1111-1111-1111-111111111111")
- **Dates** in ISO format (e.g., "2024-01-01T00:00:00")
- **Decimal** values as numbers
- **Related entities** included in responses

## 🚀 Step 3: Test the Integration

1. **Start both applications:**
   ```bash
   # Terminal 1: Start Angular
   cd /Users/airm2/the-assemblers1
   ng serve

   # Terminal 2: Start API
   cd /Users/airm2/the-assemblers1/AssemblersApi
   dotnet run
   ```

2. **Test API endpoints:**
   ```bash
   # Test categories
   curl -X GET "http://localhost:5161/api/categories"

   # Test users
   curl -X GET "http://localhost:5161/api/users"
   ```

3. **Test Angular frontend:**
   - Open `http://localhost:4200`
   - Check browser console for any CORS errors
   - Verify data is loading from the API

## 🐛 Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. Ensure the API is running on `http://localhost:5161`
2. Check that CORS is configured in `Program.cs`
3. Verify Angular is running on `http://localhost:4200`

### Data Format Issues
- Ensure your Angular models match the API response structure
- Check that GUIDs are handled as strings
- Verify date formats are properly parsed

### Connection Issues
- Ensure both applications are running
- Check that the API URL in environment files is correct
- Verify the API is accessible via browser/Postman

## 📝 Next Steps

1. **Remove Mock Data** - Replace mock data services with API calls
2. **Add Error Handling** - Implement proper error handling in services
3. **Add Loading States** - Show loading indicators while API calls are in progress
4. **Add Authentication** - Implement JWT authentication when ready
5. **Add Validation** - Add form validation for API requests

## 🎯 Benefits

- **Real Data** - Your Angular app now uses real database data
- **Persistence** - Data persists between sessions
- **Scalability** - API can handle multiple clients
- **Consistency** - Single source of truth for data
- **Testing** - Easy to test with real data scenarios

Your Angular frontend is now connected to a real .NET Web API backend with a SQL Server database! 🎉
