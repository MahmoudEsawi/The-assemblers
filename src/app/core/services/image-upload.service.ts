import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ImageUploadResult {
  id: string;
  url: string;
  thumbnailUrl: string;
  originalName: string;
  size: number;
  width: number;
  height: number;
  uploadedAt: Date;
}

export interface ImageUploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private uploadProgressSubject = new BehaviorSubject<ImageUploadProgress[]>([]);
  private maxFileSize = 5 * 1024 * 1024; // 5MB
  private allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  private maxWidth = 1920;
  private maxHeight = 1080;
  private thumbnailSize = 300;

  public uploadProgress$ = this.uploadProgressSubject.asObservable();

  constructor() {}

  // Upload single image
  async uploadImage(file: File, folder: string = 'general'): Promise<ImageUploadResult> {
    this.validateFile(file);
    
    const fileId = this.generateFileId();
    this.updateProgress(fileId, 0, 'uploading');

    try {
      // Compress image
      const compressedFile = await this.compressImage(file);
      this.updateProgress(fileId, 25, 'processing');

      // Create thumbnail
      const thumbnail = await this.createThumbnail(compressedFile);
      this.updateProgress(fileId, 50, 'processing');

      // Upload to server (mock implementation)
      const result = await this.uploadToServer(compressedFile, thumbnail, folder);
      this.updateProgress(fileId, 100, 'completed');

      return result;
    } catch (error) {
      this.updateProgress(fileId, 0, 'error', error.message);
      throw error;
    }
  }

  // Upload multiple images
  async uploadImages(files: File[], folder: string = 'general'): Promise<ImageUploadResult[]> {
    const results: ImageUploadResult[] = [];
    
    for (const file of files) {
      try {
        const result = await this.uploadImage(file, folder);
        results.push(result);
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
        // Continue with other files
      }
    }

    return results;
  }

  // Compress image
  private async compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = this.calculateDimensions(img.width, img.height);

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          0.8 // Quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Create thumbnail
  private async createThumbnail(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate thumbnail dimensions
        const { width, height } = this.calculateThumbnailDimensions(img.width, img.height);
        
        canvas.width = width;
        canvas.height = height;

        // Draw thumbnail
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const thumbnailFile = new File([blob], `thumb_${file.name}`, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(thumbnailFile);
            } else {
              reject(new Error('Failed to create thumbnail'));
            }
          },
          'image/jpeg',
          0.7
        );
      };

      img.onerror = () => reject(new Error('Failed to load image for thumbnail'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Calculate dimensions maintaining aspect ratio
  private calculateDimensions(originalWidth: number, originalHeight: number): { width: number; height: number } {
    let width = originalWidth;
    let height = originalHeight;

    // Scale down if too large
    if (width > this.maxWidth || height > this.maxHeight) {
      const aspectRatio = width / height;
      
      if (width > height) {
        width = this.maxWidth;
        height = width / aspectRatio;
      } else {
        height = this.maxHeight;
        width = height * aspectRatio;
      }
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  // Calculate thumbnail dimensions
  private calculateThumbnailDimensions(originalWidth: number, originalHeight: number): { width: number; height: number } {
    let width = originalWidth;
    let height = originalHeight;

    // Scale to fit within thumbnail size
    if (width > this.thumbnailSize || height > this.thumbnailSize) {
      const aspectRatio = width / height;
      
      if (width > height) {
        width = this.thumbnailSize;
        height = width / aspectRatio;
      } else {
        height = this.thumbnailSize;
        width = height * aspectRatio;
      }
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  // Validate file
  private validateFile(file: File): void {
    if (!this.allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed. Allowed types: ${this.allowedTypes.join(', ')}`);
    }

    if (file.size > this.maxFileSize) {
      throw new Error(`File size ${this.formatFileSize(file.size)} exceeds maximum size of ${this.formatFileSize(this.maxFileSize)}`);
    }
  }

  // Upload to server (mock implementation)
  private async uploadToServer(file: File, thumbnail: File, folder: string): Promise<ImageUploadResult> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real implementation, you would upload to your server here
    const result: ImageUploadResult = {
      id: this.generateFileId(),
      url: URL.createObjectURL(file), // Mock URL
      thumbnailUrl: URL.createObjectURL(thumbnail), // Mock thumbnail URL
      originalName: file.name,
      size: file.size,
      width: 0, // Would be set from actual image dimensions
      height: 0, // Would be set from actual image dimensions
      uploadedAt: new Date()
    };

    return result;
  }

  // Update upload progress
  private updateProgress(fileId: string, progress: number, status: ImageUploadProgress['status'], error?: string): void {
    const currentProgress = this.uploadProgressSubject.value;
    const existingIndex = currentProgress.findIndex(p => p.fileId === fileId);
    
    const progressUpdate: ImageUploadProgress = {
      fileId,
      progress,
      status,
      error
    };

    if (existingIndex >= 0) {
      currentProgress[existingIndex] = progressUpdate;
    } else {
      currentProgress.push(progressUpdate);
    }

    this.uploadProgressSubject.next([...currentProgress]);

    // Remove completed uploads after 5 seconds
    if (status === 'completed') {
      setTimeout(() => {
        this.removeProgress(fileId);
      }, 5000);
    }
  }

  // Remove progress tracking
  private removeProgress(fileId: string): void {
    const currentProgress = this.uploadProgressSubject.value;
    const filtered = currentProgress.filter(p => p.fileId !== fileId);
    this.uploadProgressSubject.next(filtered);
  }

  // Generate file ID
  private generateFileId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Format file size
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get upload progress for a specific file
  getUploadProgress(fileId: string): ImageUploadProgress | undefined {
    return this.uploadProgressSubject.value.find(p => p.fileId === fileId);
  }

  // Clear all progress
  clearAllProgress(): void {
    this.uploadProgressSubject.next([]);
  }

  // Delete image (mock implementation)
  async deleteImage(imageId: string): Promise<boolean> {
    // Simulate delete delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real implementation, you would delete from your server here
    console.log('Deleting image:', imageId);
    return true;
  }

  // Get image info
  getImageInfo(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
}
