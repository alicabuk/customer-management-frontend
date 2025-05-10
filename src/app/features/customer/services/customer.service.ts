import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly API_URL = `${environment.apiUrl}/customer`;

  constructor(private http: HttpClient) {}

  listCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.API_URL}/list`);
  }

  createCustomer(
    customer: Customer
  ): Observable<{ message: string; data: Customer }> {
    return this.http.post<{ message: string; data: Customer }>(
      `${this.API_URL}/add`,
      customer
    );
  }

  updateCustomer(
    id: number,
    customer: Customer
  ): Observable<{ message: string; data: Customer }> {
    return this.http.put<{ message: string; data: Customer }>(
      `${this.API_URL}/update/${id}`,
      customer
    );
  }

  deleteCustomer(id: number): Observable<{ status: string }> {
    return this.http.delete<{ status: string }>(`${this.API_URL}/delete/${id}`);
  }
}
