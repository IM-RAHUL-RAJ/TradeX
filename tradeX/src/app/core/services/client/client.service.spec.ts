import { TestBed } from '@angular/core/testing';
import { ClientService } from './client.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';import { Client } from '../../models/client.model';
import { InvestmentPreferences } from '../../models/preferences.model';
import { environment } from '../../../../environments/environment';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  const testClient: Client = {
    clientId: 'C001',
    email: 'john@example.com',
    password: 'securePassword123',
    dateOfBirth: '1990-01-01',
    postalCode: '560001',
    cashBalance: 100000,
    portfolio: [],
    country: 'India',
    identification: [
      { type: 'Aadhaar', value: '123456789012' }
    ],
    preferences: undefined
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientService]
    });
    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a client', () => {
    service.registerClient(testClient).subscribe(response => {
      expect(response).toEqual({ success: true });
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/client/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(testClient);
    req.flush({ success: true });
  });

  it('should verify a client', () => {
    const verifyResponse = { success: true, message: 'Verified', clientId: 'C001' };
    service.verifyClient(testClient).subscribe(response => {
      expect(response).toEqual(verifyResponse);
    });
    const req = httpMock.expectOne('http://localhost:8081/client/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(testClient);
    req.flush(verifyResponse);
  });

  it('should login and get clientId', () => {
    service.loginAndGetClientId('john@example.com', 'securePassword123').subscribe(response => {
      expect(response).toBe('C001');
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/client/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'john@example.com', password: 'securePassword123' });
    expect(req.request.responseType).toBe('text');
    req.flush('C001');
  });

  it('should get client by email', () => {
    service.getClientByEmail('john@example.com').subscribe(response => {
      expect(response).toEqual(testClient);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/client/john@example.com`);
    expect(req.request.method).toBe('GET');
    req.flush(testClient);
  });

  it('should upsert preferences', () => {
    const prefs: InvestmentPreferences = {
      purpose: 'Retirement',
      risk: 'High Risk',
      income: '40001-60000',
      length: '5-7 years',
      roboAdvisor: true
    };
    service.upsertPreferences('john@example.com', prefs).subscribe(response => {
      expect(response).toEqual({ success: true });
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/client/john@example.com/preferences`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(prefs);
    req.flush({ success: true });
  });
});