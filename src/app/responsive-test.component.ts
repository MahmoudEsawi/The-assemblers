import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-responsive-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="responsive-test-container">
      <div class="container">
        <h1 class="text-center text-3xl font-bold mb-8">Responsive Design Test</h1>
        
        <!-- Grid Test -->
        <section class="mb-12">
          <h2 class="text-2xl font-semibold mb-6">Grid System Test</h2>
          <div class="grid grid-4 gap-4">
            <div class="card text-center">
              <h3 class="font-semibold mb-2">Card 1</h3>
              <p class="text-sm text-secondary">Responsive grid item</p>
            </div>
            <div class="card text-center">
              <h3 class="font-semibold mb-2">Card 2</h3>
              <p class="text-sm text-secondary">Responsive grid item</p>
            </div>
            <div class="card text-center">
              <h3 class="font-semibold mb-2">Card 3</h3>
              <p class="text-sm text-secondary">Responsive grid item</p>
            </div>
            <div class="card text-center">
              <h3 class="font-semibold mb-2">Card 4</h3>
              <p class="text-sm text-secondary">Responsive grid item</p>
            </div>
          </div>
        </section>

        <!-- Button Test -->
        <section class="mb-12">
          <h2 class="text-2xl font-semibold mb-6">Button Variants Test</h2>
          <div class="flex flex-wrap gap-4">
            <button class="btn">Primary Button</button>
            <button class="btn btn-secondary">Secondary Button</button>
            <button class="btn btn-sm">Small Button</button>
            <button class="btn btn-lg">Large Button</button>
            <button class="btn btn-icon">📱</button>
            <button class="btn btn-block">Full Width Button</button>
          </div>
        </section>

        <!-- Form Test -->
        <section class="mb-12">
          <h2 class="text-2xl font-semibold mb-6">Form Elements Test</h2>
          <form class="max-w-md mx-auto">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" placeholder="Enter your name" class="form-control">
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" class="form-control">
            </div>
            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" class="form-control">
                <option>Select a category</option>
                <option>Electronics</option>
                <option>Furniture</option>
                <option>Home Improvement</option>
              </select>
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" placeholder="Enter your message" rows="4" class="form-control"></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn">Submit</button>
            </div>
          </form>
        </section>

        <!-- Loading States Test -->
        <section class="mb-12">
          <h2 class="text-2xl font-semibold mb-6">Loading States Test</h2>
          <div class="flex flex-wrap gap-4">
            <button class="btn" (click)="showLoading = !showLoading">
              {{ showLoading ? 'Hide' : 'Show' }} Loading
            </button>
            <button class="btn btn-secondary" (click)="showToast = !showToast">
              {{ showToast ? 'Hide' : 'Show' }} Toast
            </button>
          </div>
          
          <!-- Skeleton Loading -->
          <div class="mt-8" *ngIf="showLoading">
            <div class="card">
              <div class="skeleton skeleton-title"></div>
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text" style="width: 60%;"></div>
            </div>
          </div>
        </section>

        <!-- Responsive Utilities Test -->
        <section class="mb-12">
          <h2 class="text-2xl font-semibold mb-6">Responsive Utilities Test</h2>
          <div class="grid grid-3 gap-4">
            <div class="card text-center">
              <h3 class="font-semibold mb-2">Desktop Only</h3>
              <p class="text-sm text-secondary hidden-mobile">This text is hidden on mobile</p>
            </div>
            <div class="card text-center">
              <h3 class="font-semibold mb-2">Mobile Only</h3>
              <p class="text-sm text-secondary hidden-desktop">This text is hidden on desktop</p>
            </div>
            <div class="card text-center">
              <h3 class="font-semibold mb-2">Always Visible</h3>
              <p class="text-sm text-secondary">This text is always visible</p>
            </div>
          </div>
        </section>

        <!-- Touch Targets Test -->
        <section class="mb-12">
          <h2 class="text-2xl font-semibold mb-6">Touch Targets Test</h2>
          <div class="flex flex-wrap gap-4">
            <button class="btn">Touch Target 1</button>
            <button class="btn">Touch Target 2</button>
            <button class="btn">Touch Target 3</button>
            <button class="btn">Touch Target 4</button>
          </div>
          <p class="text-sm text-secondary mt-4">
            All buttons have minimum 44px touch targets for better mobile usability.
          </p>
        </section>
      </div>

      <!-- Loading Overlay -->
      <div id="loading-overlay" [class.show]="showLoading">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading<span class="loading-dots"></span></p>
        </div>
      </div>

      <!-- Toast Notification -->
      <div class="toast toast-success" [class.show]="showToast">
        <div class="toast-content">
          <div class="toast-icon"><i class="fas fa-check-circle"></i></div>
          <div class="toast-message">
            <div class="toast-title">Success!</div>
            <div class="toast-description">Your responsive design is working perfectly!</div>
          </div>
          <button class="toast-close" (click)="showToast = false">×</button>
        </div>
        <div class="toast-progress"></div>
      </div>
    </div>
  `,
  styles: [`
    .responsive-test-container {
      padding: 2rem 0;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      background-color: white;
      color: #333;
      font-size: 16px;
      transition: all 0.3s ease;
      min-height: 44px;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-control::placeholder {
      color: #9ca3af;
    }
    
    @media (max-width: 767px) {
      .responsive-test-container {
        padding: 1rem 0;
      }
      
      .form-control {
        padding: 14px 16px;
        min-height: 48px;
      }
    }
  `]
})
export class ResponsiveTestComponent implements OnInit {
  showLoading = false;
  showToast = false;

  ngOnInit(): void {
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }
}
