// client.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../../models/client.model';
import { InvestmentPreferences } from '../../models/preferences.model';
import { environment } from '../../../../environments/environment';

// Add FMTSResponse interface
export interface FMTSResponse {
  success: boolean;
  message: string;
  clientId?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private http: HttpClient) {}

  registerClient(client: Client): Observable<any> {
    return this.http.post(`${environment.apiUrl}/client/register`, client);
  }

  // Register a new client (returns a Promise with clientId and token)
  verifyClient(client: any): Observable<FMTSResponse> {
    return this.http.post<FMTSResponse>(
      'http://localhost:8081/client/register',
      client
    );
  }

  loginAndVerify(email: string, password: string): Observable<any> {
  return this.http.post<any>(
    `${environment.apiUrl}/client/login`,
    { email, password }
  );
}

  getClientByEmail(email: string): Observable<Client> {
    return this.http.get<Client>(`${environment.apiUrl}/client/${email}`);
  }

  upsertPreferences(email: string, prefs: InvestmentPreferences): Observable<any> {
    return this.http.put(`${environment.apiUrl}/client/${email}/preferences`, prefs);
  }

    // Register a new client (returns a Promise with clientId)
verifyEmailExists(email: string): Observable<boolean> {
  console.log(email);
  return this.http.get<boolean>(`${environment.apiUrl}/client/check-email?email=${email}`);
}
}
