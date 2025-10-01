import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortfolioPosition } from '../../models/portfolio.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  constructor(private http: HttpClient) {}

  getPortfolioPositions(clientId: string): Observable<any[]> {
    const url = `${environment.apiUrl}/portfolio/${clientId}`;
    return this.http.get<any[]>(url);
  }
}
