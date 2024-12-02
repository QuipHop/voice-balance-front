import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = 'http://localhost:8000';
  public categories: any[] = [];

  constructor(private http: HttpClient) {}

  // Login with email and password
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/api/auth/email-login`, { email, password });
  }

  // Save tokens to localStorage
  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  // Logout and clear tokens
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Get the access token
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Fetch transactions
  getTransactions(): Observable<any[]> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Bearer token is missing.');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.API_URL}/api/transaction`, {headers}).pipe(
      map((response: any) => {
        // Flatten the grouped data
        const transactions = Object.values(response.groupedData).flat();
        return transactions;
      }),
      catchError((error: any) => {
        console.error('Error fetching transactions:', error);
        return of([]);
      })
    );
  }

  createTransaction(transaction: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Bearer token is missing.');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.post(`${this.API_URL}/api/transaction`, transaction, {headers}).pipe(
      catchError((error) => {
        console.error('Error creating transaction:', error);
        throw error;
      })
    );
  }

  // Fetch categories
  getCategories(): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Bearer token is missing.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.API_URL}/api/categories`, { headers });
  }

  // Add a new category
  addCategory(name: string, type: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Bearer token is missing.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = { name, type };
    return this.http.post(`${this.API_URL}/api/categories`, body, { headers });
  }

  sendVoice(file: File): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('User is not authenticated.');
    }

    const formData = new FormData();
    formData.append('file', file, 'wqdqwd.wav'); // Use the correct key: 'file'

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.API_URL}/api/voice`, formData, { headers });
  }
}
