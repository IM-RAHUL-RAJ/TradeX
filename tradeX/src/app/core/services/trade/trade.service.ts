import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TradeService {
  constructor(private http: HttpClient) {}

  getTradeHistory(clientId?: string): Observable<any> {
    const url = `${environment.apiUrl}/trades/${clientId}`;
    return this.http.get<any>(url);
  }

  executeTrade(tradeRequest: any, token: string): Observable<any> {
    const url = `${environment.apiUrl}/trades/execute`;
    const headersObj: { [header: string]: string | string[] } = {};
    if (token) {
      headersObj['Authorization'] = `Bearer ${token}`;
    }
    return this.http.post<any>(url, tradeRequest, { headers: headersObj });
  }
}
