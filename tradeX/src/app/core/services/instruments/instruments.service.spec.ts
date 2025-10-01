import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InstrumentsService, Price } from './instruments.service';
import { Instrument } from '../../models/instrument.model';

describe('InstrumentsService', () => {
  let service: InstrumentsService;
  let httpMock: HttpTestingController;

  // Sample mock data
  const mockInstruments: Instrument[] = [
    { instrumentId: 'AAPL', categoryId: 'EQUITIES', description: 'Apple Inc.', minQuantity: 1, maxQuantity: 100 },
    { instrumentId: 'TSLA', categoryId: 'EQUITIES', description: 'Tesla Inc.', minQuantity: 1, maxQuantity: 100 },
    { instrumentId: 'USBONDS', categoryId: 'BONDS', description: 'US Government Bonds', minQuantity: 1, maxQuantity: 1000, externalIdType: 'ISIN', externalId: 'US1234567890' },
  ];

  const mockPrices: Price[] = [
    { askPrice: 200, bidPrice: 198, timestamp: '2023-08-01', instrument: mockInstruments[0] },
    { askPrice: 300, bidPrice: 295, timestamp: '2023-08-01', instrument: mockInstruments[1] },
    { askPrice: 105, bidPrice: 104, timestamp: '2023-08-01', instrument: mockInstruments[2] }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InstrumentsService]
    });
    service = TestBed.inject(InstrumentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all instruments', () => {
    service.getInstruments().subscribe(data => {
      expect(data).toEqual(mockInstruments);
      expect(data.length).toBe(3);
    });
    const req = httpMock.expectOne('instrument.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockInstruments);
  });

  it('should fetch all prices', () => {
    service.getPrices().subscribe(data => {
      expect(data).toEqual(mockPrices);
      expect(data.length).toBe(3);
    });
    const req = httpMock.expectOne('prices.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockPrices);
  });

  it('should get instrument with price by ID (existent)', () => {
    service.getInstrumentWithPrice('AAPL').subscribe(price => {
      expect(price).toEqual(mockPrices[0]);
    });
    const req = httpMock.expectOne('prices.json');
    req.flush(mockPrices);
  });

  it('should return undefined from getInstrumentWithPrice for non-existent instrument', () => {
    service.getInstrumentWithPrice('NOTFOUND').subscribe(price => {
      expect(price).toBeUndefined();
    });
    const req = httpMock.expectOne('prices.json');
    req.flush(mockPrices);
  });

  it('should get distinct categories', () => {
    service.getCategories().subscribe(categories => {
      expect(categories.length).toBe(2);
      expect(categories).toContain(jasmine.objectContaining({ id: 'EQUITIES', name: 'EQUITIES' }));
      expect(categories).toContain(jasmine.objectContaining({ id: 'BONDS', name: 'BONDS' }));
    });
    const req = httpMock.expectOne('instrument.json');
    req.flush(mockInstruments);
  });

  it('should get instruments by category', () => {
    service.getInstrumentsByCategory('EQUITIES').subscribe(data => {
      expect(data.length).toBe(2);
      expect(data.every(i => i.categoryId === 'EQUITIES')).toBeTrue();
    });
    const req = httpMock.expectOne('instrument.json');
    req.flush(mockInstruments);
  });

  it('should return empty array from getInstrumentsByCategory if none match', () => {
    service.getInstrumentsByCategory('REAL_ESTATE').subscribe(data => {
      expect(data).toEqual([]);
    });
    const req = httpMock.expectOne('instrument.json');
    req.flush(mockInstruments);
  });

  it('should get prices for multiple instruments', () => {
    service.getPricesForInstruments(['AAPL', 'USBONDS']).subscribe(prices => {
      expect(prices.length).toBe(2);
      expect(prices).toContain(mockPrices[0]);
      expect(prices).toContain(mockPrices[2]);
    });
    const req = httpMock.expectOne('prices.json');
    req.flush(mockPrices);
  });

  it('should return empty array from getPricesForInstruments if none match', () => {
    service.getPricesForInstruments(['FAKE1', 'FAKE2']).subscribe(prices => {
      expect(prices).toEqual([]);
    });
    const req = httpMock.expectOne('prices.json');
    req.flush(mockPrices);
  });

  it('should get price for a single instrument (existent)', () => {
    service.getPriceForInstrument('AAPL').subscribe(price => {
      expect(price).toEqual(mockPrices[0]);
    });
    const req = httpMock.expectOne('prices.json');
    req.flush(mockPrices);
  });

  it('should get undefined from getPriceForInstrument if not found', () => {
    service.getPriceForInstrument('BAD').subscribe(price => {
      expect(price).toBeUndefined();
    });
    const req = httpMock.expectOne('prices.json');
    req.flush(mockPrices);
  });

  it('getAllInstruments returns same as getInstruments', () => {
    service.getAllInstruments().subscribe(data => {
      expect(data).toEqual(mockInstruments);
    });
    const req = httpMock.expectOne('instrument.json');
    req.flush(mockInstruments);
  });

  it('getAllPrices returns same as getPrices', () => {
    service.getAllPrices().subscribe(data => {
      expect(data).toEqual(mockPrices);
    });
    const req = httpMock.expectOne('prices.json');
    req.flush(mockPrices);
  });

});
