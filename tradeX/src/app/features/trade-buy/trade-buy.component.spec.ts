import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { TradeBuyComponent } from './trade-buy.component';
import { InstrumentsService } from '../../core/services/instruments/instruments.service';
import { TradeService } from '../../core/services/trade/trade.service';
import { WalletService } from '../../core/services/wallet/wallet.service';
import { PortfolioService } from '../../core/services/portfolio/portfolio.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

describe('TradeBuyComponent', () => {
  let component: TradeBuyComponent;
  let fixture: ComponentFixture<TradeBuyComponent>;
  let instrumentsServiceSpy: jasmine.SpyObj<InstrumentsService>;
  let tradeServiceSpy: jasmine.SpyObj<TradeService>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let portfolioServiceSpy: jasmine.SpyObj<PortfolioService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockInstrument = {
    instrumentId: 'ABC',
    description: 'Test Instrument',
    categoryId: 'Equity',
    minQuantity: 1,
    maxQuantity: 100
  };

  const mockInstrumentWithPrice = {
    askPrice: 100,
    bidPrice: 98,
    timestamp: '2025-08-19T09:00:00Z',
    instrument: mockInstrument
  };

  beforeEach(() => {
    instrumentsServiceSpy = jasmine.createSpyObj('InstrumentsService', [
      'getInstruments',
      'getInstrumentWithPrice'
    ]);
    tradeServiceSpy = jasmine.createSpyObj('TradeService', ['executeTrade']);
    walletServiceSpy = jasmine.createSpyObj('WalletService', ['getWalletBalance']);
    portfolioServiceSpy = jasmine.createSpyObj('PortfolioService', ['getPortfolioPositions']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    // Mock MatDialog internals for Angular Material
    (dialogSpy as any).openDialogs = [];
    dialogSpy.open.and.callFake(() => {
      // Simulate dialogRef with required internals
      (dialogSpy as any).openDialogs.push({});
      return {
        afterClosed: () => of(true),
        _containerInstance: {},
        openDialogs: (dialogSpy as any).openDialogs
      } as any;
    });
    dialogSpy.closeAll.and.callFake(() => {
      (dialogSpy as any).openDialogs = [];
    });

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TradeBuyComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: InstrumentsService, useValue: instrumentsServiceSpy },
        { provide: TradeService, useValue: tradeServiceSpy },
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: PortfolioService, useValue: portfolioServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ActivatedRoute, useValue: {} }
      ]
    });

    fixture = TestBed.createComponent(TradeBuyComponent);
    component = fixture.componentInstance;

    sessionStorage.setItem('clientId', 'C001');
    instrumentsServiceSpy.getInstruments.and.returnValue(of([mockInstrument]));
    instrumentsServiceSpy.getInstrumentWithPrice.and.returnValue(of(mockInstrumentWithPrice));
    walletServiceSpy.getWalletBalance.and.returnValue(of({ cashBalance: 1000 }));
    tradeServiceSpy.executeTrade.and.returnValue(of({}));
    portfolioServiceSpy.getPortfolioPositions.and.returnValue(of([{ instrumentId: 'ABC', quantity: 10 }]));
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load instruments and cash balance on init', () => {
    component.ngOnInit();
    expect(instrumentsServiceSpy.getInstruments).toHaveBeenCalled();
    expect(walletServiceSpy.getWalletBalance).toHaveBeenCalledWith('C001');
    expect(component.cashBalance).toBe(1000);
    expect(component.instruments.length).toBe(1);
  });

  it('should open trade dialog and set prices for buy', () => {
    component.selectedInstrument = mockInstrumentWithPrice;
    component.openTradeDialog('buy');
    expect(component.tradePrice).toBe(100);
    expect(component.popupMode).toBe('buy');
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should open trade dialog and set prices for sell', () => {
    component.selectedInstrument = mockInstrumentWithPrice;
    component.openTradeDialog('sell');
    expect(component.tradePrice).toBe(98);
    expect(component.popupMode).toBe('sell');
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should calculate total price correctly', () => {
    component.tradePrice = 100;
    component.quantity = 5;
    component.calculateTotal();
    expect(component.totalPrice).toBe(500);
  });

  it('should show error if buy quantity exceeds cash', () => {
    component.selectedInstrument = mockInstrumentWithPrice;
    component.popupMode = 'buy';
    component.quantity = 20;
    component.tradePrice = 100;
    component.calculateTotal();
    component.cashBalance = 1000;
    component.tradeAction();
    expect(component.tradeErrorMessage).toContain('Insufficient cash');
  });

  it('should show error if sell quantity exceeds owned', fakeAsync(() => {
    component.selectedInstrument = mockInstrumentWithPrice;
    component.popupMode = 'sell';
    component.quantity = 20;
    component.tradePrice = 98;
    component.calculateTotal();
    portfolioServiceSpy.getPortfolioPositions.and.returnValue(of([{ instrumentId: 'ABC', quantity: 10 }]));
    component.tradeAction();
    tick();
    expect(component.tradeErrorMessage).toContain('Cannot sell more than you own');
  }));

  it('should show error if user does not own instrument for sell', fakeAsync(() => {
    component.selectedInstrument = mockInstrumentWithPrice;
    component.popupMode = 'sell';
    component.quantity = 5;
    component.tradePrice = 98;
    component.calculateTotal();
    portfolioServiceSpy.getPortfolioPositions.and.returnValue(of([]));
    component.tradeAction();
    tick();
    expect(component.tradeErrorMessage).toContain('do not own any');
  }));

  it('should execute trade for valid buy', () => {
    component.selectedInstrument = mockInstrumentWithPrice;
    component.popupMode = 'buy';
    component.quantity = 5;
    component.tradePrice = 100;
    component.calculateTotal();
    component.cashBalance = 1000;
    component.tradeAction();
    expect(tradeServiceSpy.executeTrade).toHaveBeenCalled();
    expect(dialogSpy.closeAll).toHaveBeenCalled();
  });

  it('should execute trade for valid sell', fakeAsync(() => {
    component.selectedInstrument = mockInstrumentWithPrice;
    component.popupMode = 'sell';
    component.quantity = 5;
    component.tradePrice = 98;
    component.calculateTotal();
    portfolioServiceSpy.getPortfolioPositions.and.returnValue(of([{ instrumentId: 'ABC', quantity: 10 }]));
    component.tradeAction();
    tick();
    expect(tradeServiceSpy.executeTrade).toHaveBeenCalled();
    expect(dialogSpy.closeAll).toHaveBeenCalled();
  }));

  it('should show error if tradeService fails', () => {
    component.selectedInstrument = mockInstrumentWithPrice;
    component.popupMode = 'buy';
    component.quantity = 5;
    component.tradePrice = 100;
    component.calculateTotal();
    tradeServiceSpy.executeTrade.and.returnValue(throwError(() => ({ error: { message: 'Trade failed' } })));
    component.tradeAction();
    expect(component.tradeErrorMessage).toBe('Trade failed');
  });
});