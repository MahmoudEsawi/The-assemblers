import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadService, ImageUploadResult, ImageUploadProgress } from '../../../core/services/image-upload.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit, OnDestroy {
  @Input() multiple: boolean = false;
  @Input() maxFiles: number = 5;
  @Input() folder: string = 'general';
  @Input() acceptedTypes: string = 'image/*';
  @Input() maxSize: number = 5; // MB
  @Input() showPreview: boolean = true;
  @Input() showProgress: boolean = true;

  @Output() imagesUploaded = new EventEmitter<ImageUploadResult[]>();
  @Output() uploadProgress = new EventEmitter<ImageUploadProgress[]>();
  @Output() uploadError = new EventEmitter<string>();

  selectedFiles: File[] = [];
  uploadedImages: ImageUploadResult[] = [];
  uploadProgressList: ImageUploadProgress[] = [];
  isDragOver: boolean = false;
  isUploading: boolean = false;

  constructor(
    private imageUploadService: ImageUploadService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Subscribe to upload progress
    this.imageUploadService.uploadProgress$.subscribe(progress => {
      this.uploadProgressList = progress;
      this.uploadProgress.emit(progress);
    });
  }

  ngOnDestroy(): void {
    // Cleanup
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer?.files) {
      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }

  private handleFiles(files: File[]): void {
    // Filter only image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      this.notificationService.showError('Please select only image files');
      return;
    }

    // Check file count limit
    if (this.selectedFiles.length + imageFiles.length > this.maxFiles) {
      this.notificationService.showError(`Maximum ${this.maxFiles} files allowed`);
      return;
    }

    // Check file size
    const oversizedFiles = imageFiles.filter(file => file.size > this.maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      this.notificationService.showError(`Some files exceed ${this.maxSize}MB limit`);
      return;
    }

    this.selectedFiles = [...this.selectedFiles, ...imageFiles];
  }

  async uploadImages(): Promise<void> {
    if (this.selectedFiles.length === 0) {
      this.notificationService.showWarning('No files selected');
      return;
    }

    this.isUploading = true;

    try {
      const results = await this.imageUploadService.uploadImages(this.selectedFiles, this.folder);
      this.uploadedImages = [...this.uploadedImages, ...results];
      this.selectedFiles = [];
      
      this.notificationService.showSuccess(`${results.length} images uploaded successfully`);
      this.imagesUploaded.emit(results);
    } catch (error) {
      this.notificationService.showError('Failed to upload images');
      this.uploadError.emit(error.message);
    } finally {
      this.isUploading = false;
    }
  }

  removeSelectedFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  removeUploadedImage(index: number): void {
    const image = this.uploadedImages[index];
    this.imageUploadService.deleteImage(image.id).then(() => {
      this.uploadedImages.splice(index, 1);
      this.notificationService.showSuccess('Image deleted successfully');
    }).catch(() => {
      this.notificationService.showError('Failed to delete image');
    });
  }

  clearAll(): void {
    this.selectedFiles = [];
    this.uploadedImages = [];
    this.imageUploadService.clearAllProgress();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getUploadProgress(fileName: string): ImageUploadProgress | undefined {
    return this.uploadProgressList.find(p => p.fileId === fileName);
  }

  isFileUploading(fileName: string): boolean {
    const progress = this.getUploadProgress(fileName);
    return progress ? progress.status === 'uploading' || progress.status === 'processing' : false;
  }

  getUploadProgressPercentage(fileName: string): number {
    const progress = this.getUploadProgress(fileName);
    return progress ? progress.progress : 0;
  }

  triggerFileInput(): void {
    const input = document.getElementById('fileInput') as HTMLInputElement;
    input.click();
  }

  getFilePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  viewImage(url: string): void {
    window.open(url, '_blank');
  }
}
