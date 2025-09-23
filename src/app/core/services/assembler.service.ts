import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Assembler } from '../models/assembler.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class AssemblerService {
  constructor(private mockDataService: MockDataService) {}

  getAssemblers(): Observable<Assembler[]> {
    return of(this.mockDataService.getAssemblers()).pipe(delay(300));
  }

  getAssemblerById(id: string): Observable<Assembler | undefined> {
    return of(this.mockDataService.getAssemblerById(id)).pipe(delay(300));
  }

  getAssemblersByService(serviceId: string): Observable<Assembler[]> {
    return of(this.mockDataService.getAssemblersByService(serviceId)).pipe(delay(300));
  }
}