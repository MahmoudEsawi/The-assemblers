import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from './core/services/category.service';
import { AuthService } from './core/services/auth.service';
import { Category } from './core/models/category.model';
import { User } from './core/models/user.model';

@Component({
  selector: 'app-test-api',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
      <h2>API Test Component</h2>
      
      <!-- Login Test Section -->
      <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h3>Login Test</h3>
        <div style="margin-bottom: 15px;">
          <label>Email:</label>
          <input type="email" [(ngModel)]="loginEmail" placeholder="john@example.com" style="margin-left: 10px; padding: 5px;">
        </div>
        <div style="margin-bottom: 15px;">
          <label>Password:</label>
          <input type="password" [(ngModel)]="loginPassword" placeholder="password123" style="margin-left: 10px; padding: 5px;">
        </div>
        <button (click)="testLogin()" [disabled]="!loginEmail || !loginPassword" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px;">
          Test Login
        </button>
        <div *ngIf="loginResult" style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
          <strong>Login Result:</strong>
          <pre>{{ loginResult | json }}</pre>
        </div>
      </div>

      <!-- Categories Test Section -->
      <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h3>Categories API Test</h3>
        <button (click)="testCategoriesApi()" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px;">
          Test Categories API
        </button>
        <div *ngIf="categories" style="margin-top: 15px;">
          <h4>Categories ({{ categories.length }}):</h4>
          <pre>{{ categories | json }}</pre>
        </div>
      </div>

      <!-- Users Test Section -->
      <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h3>Users API Test</h3>
        <button (click)="testUsersApi()" style="padding: 8px 16px; background: #17a2b8; color: white; border: none; border-radius: 4px;">
          Test Users API
        </button>
        <div *ngIf="users" style="margin-top: 15px;">
          <h4>Users ({{ users.length }}):</h4>
          <pre>{{ users | json }}</pre>
        </div>
      </div>

      <!-- Error Display -->
      <div *ngIf="error" style="color: red; padding: 15px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
        <h4>Error:</h4>
        <pre>{{ error }}</pre>
      </div>

      <!-- Test Credentials -->
      <div style="margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 8px;">
        <h3>Test Credentials</h3>
        <p><strong>Customer:</strong> john@example.com / password123</p>
        <p><strong>Assembler:</strong> mike@example.com / password123</p>
        <p><strong>Assembler:</strong> sarah@example.com / password123</p>
        <p><strong>Assembler:</strong> david@example.com / password123</p>
        <p><strong>Assembler:</strong> lisa@example.com / password123</p>
      </div>
    </div>
  `,
  styles: []
})
export class TestApiComponent implements OnInit {
  categories: Category[] | null = null;
  users: User[] | null = null;
  loginResult: any = null;
  error: any = null;
  loginEmail: string = '';
  loginPassword: string = '';

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  testLogin() {
    this.error = null;
    this.loginResult = null;
    
    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: (user) => {
        this.loginResult = {
          success: true,
          user: user,
          message: `Successfully logged in as ${user.role}`
        };
        console.log('Login successful:', user);
      },
      error: (err) => {
        this.error = err;
        this.loginResult = {
          success: false,
          error: err.message || 'Login failed'
        };
        console.error('Login error:', err);
      }
    });
  }

  testCategoriesApi() {
    this.error = null;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Categories:', data);
      },
      error: (err) => {
        this.error = err;
        console.error('Error fetching categories:', err);
      }
    });
  }

  testUsersApi() {
    this.error = null;
    this.authService.getUserByEmail('john@example.com').subscribe({
      next: (data) => {
        this.users = [data];
        console.log('User:', data);
      },
      error: (err) => {
        this.error = err;
        console.error('Error fetching user:', err);
      }
    });
  }
}