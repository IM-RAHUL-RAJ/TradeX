import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface WalletRequest {
  clientId: string;
  amount: number;
}

export interface WalletResponse {
  clientId: string;
  cashBalance: number;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private baseUrl = `${environment.apiUrl}/wallet`;

  // Shared BehaviorSubject for wallet cash balance
  private cashBalanceSubject = new BehaviorSubject<number>(0);
  cashBalance$ = this.cashBalanceSubject.asObservable();

  constructor(private http: HttpClient) {}

  getWalletBalance(clientId?: string): Observable<WalletResponse> {
    const url = `${this.baseUrl}/${clientId}`;
    return this.http.get<WalletResponse>(url);
  }

  deposit(request: WalletRequest): Observable<WalletResponse> {
    const url = `${this.baseUrl}/${request.clientId}/deposit`;
    return new Observable(observer => {
      this.http.post<WalletResponse>(url, request).subscribe({
        next: (res) => {
          this.cashBalanceSubject.next(res.cashBalance);
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  withdraw(request: WalletRequest): Observable<WalletResponse> {
    const url = `${this.baseUrl}/${request.clientId}/withdraw`;
    return new Observable(observer => {
      this.http.post<WalletResponse>(url, request).subscribe({
        next: (res) => {
          this.cashBalanceSubject.next(res.cashBalance);
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  setCashBalance(balance: number): void {
    this.cashBalanceSubject.next(balance);
  }
}
 