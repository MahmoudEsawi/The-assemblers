import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Service } from '../models/service.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor(private mockDataService: MockDataService) {}

  getServices(): Observable<Service[]> {
    return of(this.mockDataService.getServices()).pipe(delay(300));
  }

  getServiceById(id: string): Observable<Service | undefined> {
    return of(this.mockDataService.getServiceById(id)).pipe(delay(300));
  }
}