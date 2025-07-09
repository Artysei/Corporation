import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EmployeeDto {
  id: number;
  department: string;
  fullName: string;
  birthDate: string;
  hireDate: string;
  salary: number;
}

export interface EmployeeQuery {
  Department?: string;
  Name?: string;
  BornFrom?: string;
  BornTo?: string;
  HiredFrom?: string;
  HiredTo?: string;
  SalaryFrom?: number | string;
  SalaryTo?: number | string;
  OrderBy?:  'department' | 'name' | 'birth' | 'hire' | 'salary' | 'id';
  Asc?: boolean;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly url = '/api/employees';

  constructor(private readonly http: HttpClient) {}

  getAll(q: EmployeeQuery): Observable<EmployeeDto[]> {
    let params = new HttpParams();

    Object.entries(q).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });

    return this.http.get<EmployeeDto[]>(this.url, { params });
  }

  get(id: number) {
    return this.http.get<EmployeeDto>(`${this.url}/${id}`);
  }

  create(dto: Omit<EmployeeDto, 'id'>) {
    return this.http.post<{ id: number }>(this.url, dto);
  }

  update(id: number, dto: Omit<EmployeeDto, 'id'>) {
    return this.http.put(`${this.url}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
