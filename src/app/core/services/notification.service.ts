import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private loading = false;

  showSuccess(message: string): void {
    // Toast notification for success
    this.showToast(message, 'success');
  }

  showError(message: string): void {
    // Toast notification for error
    this.showToast(message, 'error');
  }

  showInfo(message: string): void {
    // Toast notification for info
    this.showToast(message, 'info');
  }

  showWarning(message: string): void {
    // Toast notification for warning
    this.showToast(message, 'warning');
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${this.getIcon(type)}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // Add to page
    document.body.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);
  }

  private getIcon(type: string): string {
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '<i class="fas fa-exclamation-triangle"></i>'
    };
    return icons[type] || 'ℹ';
  }

  showLoading(): void {
    this.loading = true;
    this.createLoadingOverlay();
  }

  hideLoading(): void {
    this.loading = false;
    this.removeLoadingOverlay();
  }

  private createLoadingOverlay(): void {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  private removeLoadingOverlay(): void {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.remove();
    }
  }
}
