import { TestBed } from '@angular/core/testing';
import { PortfolioService } from './portfolio.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PortfolioService]
    });
    service = TestBed.inject(PortfolioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch portfolio positions for a client', () => {
    const clientId = 'C001';
    const mockPositions = [
      { instrumentId: 'AAPL', description: 'Apple', quantity: 10, avgCost: 150 },
      { instrumentId: 'TSLA', description: 'Tesla', quantity: 5, avgCost: 700 }
    ];

    service.getPortfolioPositions(clientId).subscribe(positions => {
      expect(positions).toEqual(mockPositions);
      expect(positions.length).toBe(2);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/portfolio/${clientId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPositions);
  });
});
