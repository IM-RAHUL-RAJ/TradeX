import { Injectable } from '@angular/core';
import { Client } from './core/models/client.model';
import { InvestmentPreferences } from './core/models/preferences.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientDataService {
  private clientApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** Get a client by email */
  getClientByEmail(email: string): Observable<Client> {
    return this.http.get<Client>(`${this.clientApiUrl}/email/${encodeURIComponent(email)}`);
  }

  /** Register a new client */
  registerClient(client: Client): Observable<any> {
    return this.http.post(`${this.clientApiUrl}/register`, client);
  }

  /** Get preferences for a client by clientId */
  getPreferences(clientId: string): Observable<InvestmentPreferences> {
    console.log('Fetching preferences for clientId:', clientId);
    return this.http.get<InvestmentPreferences>(`${this.clientApiUrl}/preferences/${encodeURIComponent(clientId)}`);
  }

  /** Add preferences for a client by clientId */
  setPreferences(clientId: string, prefs: InvestmentPreferences): Observable<any> {
    return this.http.post(`${this.clientApiUrl}/preferences/save/${encodeURIComponent(clientId)}`, prefs);
  }

  /** Update existing preferences for a client by clientId */
updatePreferences(clientId: string, prefs: InvestmentPreferences): Observable<any> {
  // PUT for updating existing preferences
  return this.http.put(`${this.clientApiUrl}/preferences/update/${encodeURIComponent(clientId)}`, prefs);
}
}