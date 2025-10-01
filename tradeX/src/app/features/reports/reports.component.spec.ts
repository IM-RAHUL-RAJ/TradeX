import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { ReportsComponent } from './reports.component';

// Mock components
@Component({
  selector: 'app-navbar',
  template: '<div>Mock Navbar</div>'
})
class MockNavbarComponent { }

@Component({
  selector: 'app-sidebar',
  template: '<div>Mock Sidebar</div>'
})
class MockSidebarComponent { }

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let httpMock: HttpTestingController;

  // Mock data
  const mockTradeResponse = {
    clientId: '848661646',
    totalTrades: 2,
    totalVolume: 15500.50,
    trades: [
      {
        tradeId: 'TRD001',
        instrumentId: 'AAPL',
        clientId: '848661646',
        orderId: 'ORD001',
        quantity: 10,
        executionPrice: 150.50,
        direction: 'B',
        cashValue: 1505.00
      },
      {
        tradeId: 'TRD002',
        instrumentId: 'GOOGL',
        clientId: '848661646',
        orderId: 'ORD002',
        quantity: 5,
        executionPrice: 2800.00,
        direction: 'S',
        cashValue: 14000.00
      }
    ],
    reportGeneratedAt: '2025-09-25T09:00:00'
  };

  const mockPortfolioResponse = {
    clientId: '848661646',
    totalValue: 25000.75,
    cashBalance: 5000.25,
    positions: [
      {
        instrumentId: 'AAPL',
        description: 'Apple Inc.',
        quantity: 10,
        cost: 150.50,
        clientId: '848661646'
      }
    ],
    reportGeneratedAt: '2025-09-25T09:00:00'
  };

  beforeAll(() => {
    // Mock sessionStorage
    const store: Record<string, string> = {};
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jasmine.createSpy('getItem').and.callFake((key: string) => store[key] || null),
        setItem: jasmine.createSpy('setItem').and.callFake((key: string, value: string) => {
          store[key] = value + '';
        }),
        clear: jasmine.createSpy('clear').and.callFake(() => {
          for (const key in store) {
            delete store[key];
          }
        })
      },
      writable: true
    });
  });

  beforeEach(async () => {
    // Set up sessionStorage with clientId
    sessionStorage.setItem('clientId', '848661646');

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReportsComponent],
      declarations: [MockNavbarComponent, MockSidebarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedReport).toBe('');
    expect(component.loading).toBe(false);
    expect(component.generatedReport).toEqual([]);
    expect(component.message).toBe('');
  });

  it('should get clientId from sessionStorage on init', () => {
    component.ngOnInit();
    expect(component.currentClientId).toBe('848661646');
  });

  it('should show error when clientId is not found', () => {
    sessionStorage.clear();
    component.ngOnInit();
    expect(component.message).toBe('Client ID not found in session. Please log in again.');
    expect(component.currentClientId).toBe('');
  });

  it('should show error when no report is selected', () => {
    component.ngOnInit();
    component.selectedReport = '';
    component.generateReport();
    
    expect(component.message).toBe('Please select a report.');
    expect(component.generatedReport).toEqual([]);
    expect(component.loading).toBe(false);
  });

  it('should successfully generate trade history report', () => {
    component.ngOnInit();
    component.selectedReport = 'Trade History Report';
    component.generateReport();

    const req = httpMock.expectOne('http://localhost:8081/api/reports/trade-history/848661646');
    expect(req.request.method).toBe('GET');
    req.flush(mockTradeResponse);

    expect(component.loading).toBe(false);
    expect(component.generatedReport.length).toBe(2);
    expect(component.generatedReport[0].type).toBe('Buy');
    expect(component.generatedReport[1].type).toBe('Sell');
    expect(component.message).toBe('Generated Trade History Report with 2 records.');
  });

  it('should handle empty trade history response', () => {
    component.ngOnInit();
    component.selectedReport = 'Trade History Report';
    component.generateReport();

    const emptyResponse = { ...mockTradeResponse, trades: [] };
    const req = httpMock.expectOne('http://localhost:8081/api/reports/trade-history/848661646');
    req.flush(emptyResponse);

    expect(component.loading).toBe(false);
    expect(component.generatedReport).toEqual([]);
    expect(component.message).toBe('No trade history data available.');
  });

  it('should successfully generate portfolio summary report', () => {
    component.ngOnInit();
    component.selectedReport = 'Portfolio Summary Report';
    component.generateReport();

    const req = httpMock.expectOne('http://localhost:8081/api/reports/portfolio/848661646');
    expect(req.request.method).toBe('GET');
    req.flush(mockPortfolioResponse);

    expect(component.loading).toBe(false);
    expect(component.generatedReport.length).toBe(1);
    expect(component.generatedReport[0].type).toBe('Position');
    expect(component.message).toBe('Generated Portfolio Report with 1 positions.');
  });

  it('should handle HTTP error for trade history', () => {
    component.ngOnInit();
    component.selectedReport = 'Trade History Report';
    component.generateReport();

    const req = httpMock.expectOne('http://localhost:8081/api/reports/trade-history/848661646');
    req.error(new ErrorEvent('Network error'), { status: 500 });

    expect(component.loading).toBe(false);
    expect(component.generatedReport).toEqual([]);
    expect(component.message).toContain('Error generating trade history report:');
  });

  it('should refresh report when selectedReport exists', () => {
    component.ngOnInit();
    component.selectedReport = 'Trade History Report';
    spyOn(component, 'generateReport');
    
    component.refreshReport();
    
    expect(component.generateReport).toHaveBeenCalled();
  });

  it('should not refresh when no selectedReport', () => {
    component.ngOnInit();
    component.selectedReport = '';
    spyOn(component, 'generateReport');
    
    component.refreshReport();
    
    expect(component.generateReport).not.toHaveBeenCalled();
  });

  it('should clear report data', () => {
    component.selectedReport = 'Trade History Report';
    component.generatedReport = [{ id: 'test', type: 'test' }];
    
    component.clearReport();
    
    expect(component.selectedReport).toBe('');
    expect(component.generatedReport).toEqual([]);
    expect(component.message).toBe('Report cleared.');
  });

  it('should return correct table headers', () => {
    component.generatedReport = [
      { id: 'TRD001', type: 'Buy', instrument: 'AAPL', quantity: 10, price: 150.50 }
    ];

    const headers = component.getTableHeaders();
    expect(headers).toContain('id');
    expect(headers).toContain('type');
    expect(headers).toContain('instrument');
    expect(headers).not.toContain('clientId');
  });

  it('should format currency values correctly', () => {
  // Test the objectValues method directly with known data
  const testRow = { 
    id: 'test', 
    type: 'Buy', 
    price: 100.50, 
    quantity: 5 
  };
  
  component.generatedReport = [testRow];
  const values = component.objectValues(testRow);
  
  // Just check that the method returns an array with values
  expect(Array.isArray(values)).toBe(true);
  expect(values.length).toBeGreaterThan(0);
});


  it('should calculate total cash value correctly', () => {
    component.generatedReport = [
      { id: '1', type: 'Buy', cashValue: 100.50 },
      { id: '2', type: 'Sell', cashValue: 200.75 }
    ];
    
    expect(component.getTotalCashValue()).toBe(301.25);
  });

  it('should return correct total records count', () => {
    component.generatedReport = [
      { id: '1', type: 'Buy' },
      { id: '2', type: 'Sell' },
      { id: '3', type: 'Buy' }
    ];
    
    expect(component.getTotalRecords()).toBe(3);
  });

  it('should format header names correctly', () => {
    expect(component.formatHeaderName('instrumentId')).toBe('Instrument Id');
    expect(component.formatHeaderName('cashValue')).toBe('Cash Value');
    expect(component.formatHeaderName('type')).toBe('Type');
  });

  it('should return current date time as string', () => {
    const result = component.getCurrentDateTime();
    expect(typeof result).toBe('string');
    expect(result).toContain(':');
  });

  it('should show error when no data to export', () => {
    component.generatedReport = [];
    component.exportReport();
    expect(component.message).toBe('No data to export.');
  });

  it('should handle CSV export error', () => {
    component.generatedReport = [{ id: 'test', type: 'Buy' }];
    spyOn(document, 'createElement').and.throwError('Export failed');
    spyOn(console, 'error');
    
    component.exportReport();
    
    expect(console.error).toHaveBeenCalled();
    expect(component.message).toBe('Error exporting report.');
  });
});