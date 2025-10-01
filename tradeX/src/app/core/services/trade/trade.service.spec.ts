import { TestBed } from '@angular/core/testing';
import { TradeService } from './trade.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';

describe('TradeService', () => {
  let service: TradeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TradeService]
    });
    service = TestBed.inject(TradeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch trade history for a client', () => {
    const clientId = 'C001';
    const mockHistory = [
      { tradeId: 'T001', instrumentId: 'AAPL', quantity: 10, direction: 'B', executionPrice: 150 },
      { tradeId: 'T002', instrumentId: 'TSLA', quantity: 5, direction: 'S', executionPrice: 700 }
    ];

    service.getTradeHistory(clientId).subscribe(history => {
      expect(history).toEqual(mockHistory);
      expect(history.length).toBe(2);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/trades/${clientId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHistory);
  });

  it('should execute a trade', () => {
    const tradeRequest = { instrumentId: 'AAPL', quantity: 10, direction: 'B', clientId: 'C001' };
    const mockResponse = { success: true, tradeId: 'T003' };

    service.executeTrade(tradeRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/trades/execute`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(tradeRequest);
    req.flush(mockResponse);
  });
});