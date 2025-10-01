import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WalletService, WalletRequest, WalletResponse } from './wallet.service';
import { environment } from '../../../../environments/environment';

describe('WalletService', () => {
  let service: WalletService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WalletService]
    });
    service = TestBed.inject(WalletService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch wallet balance (positive)', () => {
    const clientId = 'abc123';
    const mockResponse: WalletResponse = { clientId, cashBalance: 500 };

    service.getWalletBalance(clientId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/wallet/${clientId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error when fetching wallet balance (negative)', () => {
    const clientId = 'abc123';
    let errorThrown = false;

    service.getWalletBalance(clientId).subscribe({
      error: (err) => {
        errorThrown = true;
        expect(err.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/wallet/${clientId}`);
    req.flush({ message: 'Error' }, { status: 500, statusText: 'Server Error' });

    expect(errorThrown).toBeTrue();
  });

  it('should deposit and update BehaviorSubject (positive)', () => {
    const request: WalletRequest = { clientId: 'abc123', amount: 100 };
    const resp: WalletResponse = { clientId: 'abc123', cashBalance: 600 };

    service.deposit(request).subscribe(response => {
      expect(response).toEqual(resp);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/wallet/${request.clientId}/deposit`);
    expect(req.request.method).toBe('POST');
    req.flush(resp);

    service.cashBalance$.subscribe(balance => {
      expect(balance).toBe(600);
    });
  });

  it('should handle error during deposit (negative)', () => {
    const request: WalletRequest = { clientId: 'abc123', amount: 100 };
    let errorThrown = false;

    service.deposit(request).subscribe({
      error: err => {
        errorThrown = true;
        expect(err.status).toBe(400);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/wallet/${request.clientId}/deposit`);
    req.flush({ message: 'Deposit failed' }, { status: 400, statusText: 'Bad Request' });

    expect(errorThrown).toBeTrue();
  });

  it('should withdraw and update BehaviorSubject (positive)', () => {
    const request: WalletRequest = { clientId: 'abc123', amount: 50 };
    const resp: WalletResponse = { clientId: 'abc123', cashBalance: 550 };

    service.withdraw(request).subscribe(response => {
      expect(response).toEqual(resp);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/wallet/${request.clientId}/withdraw`);
    expect(req.request.method).toBe('POST');
    req.flush(resp);

    service.cashBalance$.subscribe(balance => {
      expect(balance).toBe(550);
    });
  });

  it('should handle over-withdrawal edge case (edge)', () => {
    const request: WalletRequest = { clientId: 'abc123', amount: 2000 };

    service.withdraw(request).subscribe({
      error: err => {
        expect(err.status).toBe(400);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/wallet/${request.clientId}/withdraw`);
    req.flush({ message: 'Insufficient funds' }, { status: 400, statusText: 'Bad Request' });
  });

  it('should set cash balance manually (edge)', () => {
    service.setCashBalance(-100); // negative balance edge case

    service.cashBalance$.subscribe(balance => {
      expect(balance).toBe(-100);
    });
  });
});

 