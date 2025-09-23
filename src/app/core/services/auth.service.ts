import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { User } from '../models/user.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private mockDataService: MockDataService) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    const user = this.mockDataService.getUserByEmail(email);
    
    if (user && user.password === password) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(user).pipe(delay(300));
    }
    
    throw new Error('Invalid email or password');
  }

  register(userData: any): Observable<User> {
    return this.mockDataService.createUser(userData).pipe(
      map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }
}