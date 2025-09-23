import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private mockDataService: MockDataService) {}

  getCategories(): Observable<Category[]> {
    return of(this.mockDataService.getCategories()).pipe(delay(300));
  }

  getCategoryById(id: string): Observable<Category | undefined> {
    return of(this.mockDataService.getCategoryById(id)).pipe(delay(300));
  }
}