import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HistoryComponent, Trade } from './history.component';
import { PLATFORM_ID } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { TradeService } from '../../core/services/trade/trade.service';
import { of, throwError } from 'rxjs';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let tradeServiceSpy: jasmine.SpyObj<TradeService>;

  beforeEach(async () => {
    tradeServiceSpy = jasmine.createSpyObj('TradeService', ['getTradeHistory']);

    await TestBed.configureTestingModule({
      imports: [HistoryComponent, AgGridModule],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: TradeService, useValue: tradeServiceSpy },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load rowData from TradeService on init if clientId exists', () => {
    const trades = [
      {
        tradeId: 'T1',
        date: '2023-07-01T10:00:00Z',
        direction: 'BUY',
        instrumentId: 'AAPL',
        quantity: 10,
        executionPrice: 100,
        cashValue: 1000
      }
    ];
    sessionStorage.setItem('clientId', 'C001');
    tradeServiceSpy.getTradeHistory.and.returnValue(of({ trades }));

    component.ngOnInit();

    expect(tradeServiceSpy.getTradeHistory).toHaveBeenCalledWith('C001');
    expect(component.rowData.length).toBe(1);
    expect(component.rowData[0].tradeId).toBe('T1');
    expect(component.rowData[0].direction).toBe('B'); // mapped from 'BUY'
    expect(component.rowData[0].cashValue).toBe(1000);
  });

  it('should set rowData to empty array if TradeService errors', () => {
    sessionStorage.setItem('clientId', 'C001');
    tradeServiceSpy.getTradeHistory.and.returnValue(throwError(() => new Error('Service error')));

    component.ngOnInit();

    expect(component.rowData).toEqual([]);
  });

  it('should set rowData to empty array if no clientId in sessionStorage', () => {
    sessionStorage.removeItem('clientId');
    component.ngOnInit();
    expect(component.rowData).toEqual([]);
  });

  it('currencyFormatter should return formatted currency', () => {
    const formatted = (component as any).currencyFormatter({ value: 123.456 });
    expect(formatted).toBe('$123.46');
  });

  it('currencyFormatter should return empty string for null', () => {
    const formatted = (component as any).currencyFormatter({ value: null });
    expect(formatted).toBe('');
  });

  it('dateFormatter should format ISO string', () => {
    const isoDate = '2023-07-01T10:00:00Z';
    const formatted = (component as any).dateFormatter({ value: isoDate });
    expect(formatted).toContain('2023');
  });

  it('directionFormatter should return Buy or Sell correctly', () => {
    const buy = (component as any).directionFormatter({ value: 'B' });
    const sell = (component as any).directionFormatter({ value: 'S' });

    expect(buy).toBe('Buy');
    expect(sell).toBe('Sell');
  });

  it('onGridReady should call sizeColumnsToFit and log row count', () => {
    const sizeColumnsToFitSpy = jasmine.createSpy('sizeColumnsToFit');
    const getDisplayedRowCountSpy = jasmine.createSpy('getDisplayedRowCount').and.returnValue(5);
    const params = {
      api: {
        sizeColumnsToFit: sizeColumnsToFitSpy,
        getDisplayedRowCount: getDisplayedRowCountSpy
      }
    };

    spyOn(console, 'log');

    component.onGridReady(params);

    expect(sizeColumnsToFitSpy).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Grid ready:', 5, 'rows');
  });
});