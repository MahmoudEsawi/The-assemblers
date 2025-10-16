import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Assembler } from '../models/assembler.model';

@Injectable({
  providedIn: 'root'
})
export class AssemblerService {
  private apiUrl = 'http://localhost:5161/api';

  constructor(private http: HttpClient) {}

  getAssemblers(): Observable<Assembler[]> {
    return this.http.get<any>(`${this.apiUrl}/assemblers`).pipe(
      map(response => response.value || response)
    );
  }

  getAssemblerById(id: number): Observable<Assembler> {
    return this.http.get<Assembler>(`${this.apiUrl}/assemblers/${id}`);
  }

  getAssemblerByUserId(userId: number): Observable<Assembler> {
    return this.http.get<Assembler>(`${this.apiUrl}/assemblers/by-user/${userId}`);
  }

  createAssembler(assembler: any): Observable<Assembler> {
    return this.http.post<Assembler>(`${this.apiUrl}/assemblers`, assembler);
  }

  updateAssembler(id: number, assembler: Assembler): Observable<Assembler> {
    return this.http.put<Assembler>(`${this.apiUrl}/assemblers/${id}`, assembler);
  }

  deleteAssembler(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/assemblers/${id}`);
  }
}