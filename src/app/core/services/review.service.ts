import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Review } from '../models/review.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(private mockDataService: MockDataService) {}

  getReviews(): Observable<Review[]> {
    return of(this.mockDataService.getReviews()).pipe(delay(300));
  }

  getReviewsByAssembler(assemblerId: string): Observable<Review[]> {
    return of(this.mockDataService.getReviewsByAssembler(assemblerId)).pipe(delay(300));
  }

  createReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Observable<Review> {
    return this.mockDataService.createReview(reviewData);
  }
}