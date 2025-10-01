import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PortfolioComponent } from './portfolio.component';
import { PLATFORM_ID } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { PortfolioService } from '../../core/services/portfolio/portfolio.service';
import { WalletService } from '../../core/services/wallet/wallet.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { of, throwError } from 'rxjs';

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;
  let portfolioServiceSpy: jasmine.SpyObj<PortfolioService>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
  portfolioServiceSpy = jasmine.createSpyObj('PortfolioService', ['getPortfolioPositions']);
  portfolioServiceSpy.getPortfolioPositions.and.returnValue(of({ positions: [] }) as any);
    walletServiceSpy = jasmine.createSpyObj('WalletService', ['getWalletBalance']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [PortfolioComponent, AgGridModule],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: PortfolioService, useValue: portfolioServiceSpy },
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set isBrowser to true', () => {
    expect(component.isBrowser).toBe(true);
  });

  it('should load portfolio and wallet on ngOnInit if clientId exists', fakeAsync(() => {
  sessionStorage.setItem('clientId', 'C001');
  const mockPositions = [{ instrumentId: 'AAPL', description: 'Apple Inc.', quantity: 10, cost: 150 }];
  const mockWallet = { cashBalance: 100000 };

  portfolioServiceSpy.getPortfolioPositions.and.returnValue(of({ positions: mockPositions }) as any);
  walletServiceSpy.getWalletBalance.and.returnValue(of(mockWallet));

  component.ngOnInit();
  tick();

  expect(portfolioServiceSpy.getPortfolioPositions).toHaveBeenCalledWith('C001');
  expect(walletServiceSpy.getWalletBalance).toHaveBeenCalledWith('C001');
  expect(component.rowData).toEqual(mockPositions);
  expect(component.cashRemaining).toBe(100000);
  expect(component.netWorth).toBe(101500);
  }));

  it('should handle error from walletService', () => {
    sessionStorage.setItem('clientId', 'C001');
  portfolioServiceSpy.getPortfolioPositions.and.returnValue(of([]));
  walletServiceSpy.getWalletBalance.and.returnValue(throwError(() => new Error('Service error')));

  component.ngOnInit();

  expect(component.rowData).toEqual([]);
  expect(component.cashRemaining).toBe(0);
  });

  it('should format currency correctly', () => {
    expect(component['currencyFormatter']({ value: 1234.567 })).toBe('$1234.57');
    expect(component['currencyFormatter']({ value: null as any })).toBe('');
    expect(component['currencyFormatter']({ value: undefined as any })).toBe('');
    expect(component['currencyFormatter']({} as any)).toBe('');
  });

  it('should call sizeColumnsToFit on grid ready', () => {
    const api = jasmine.createSpyObj('GridApi', ['sizeColumnsToFit']);
    const params = { api };
    component.onGridReady(params);
    expect(api.sizeColumnsToFit).toHaveBeenCalled();
  });
});