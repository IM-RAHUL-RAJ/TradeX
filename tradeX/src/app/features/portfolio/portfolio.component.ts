import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PortfolioPosition } from '../../core/models/portfolio.model';
import { PortfolioService } from '../../core/services/portfolio/portfolio.service';
import { WalletService } from '../../core/services/wallet/wallet.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
// import { RoboAdvisorComponent } from '../robo-advisor/robo-advisor.component';

// Register AG Grid modules once globally
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
  CommonModule,
  HttpClientModule,
  AgGridModule,
  RouterLink,
  RouterLinkActive,
  NavbarComponent,
  SidebarComponent,
  // RoboAdvisorComponent
  ],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  // Portfolio table data
  rowData: PortfolioPosition[] = [];
  trades: any[] = [];

  // SSR check
  isBrowser: boolean;

  // Summary cards data (linked with template)
  netWorth: number = 0;
  overallGains: number = 0;
  overallReturns: string = '0%';
  cashRemaining: number = 0;

  // AG Grid columns
  columnDefs: ColDef[] = [
    { headerName: 'Instrument', field: 'instrumentId', sortable: true, filter: true },
    { headerName: 'Description', field: 'description', sortable: true, filter: true },
    { headerName: 'Quantity', field: 'quantity', sortable: true, filter: 'agNumberColumnFilter', type: 'rightAligned' },
  { headerName: 'Avg Cost', field: 'cost', sortable: true, filter: 'agNumberColumnFilter', type: 'rightAligned', valueFormatter: this.currencyFormatter.bind(this) }
  ];

  // Default col def
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  private portfolioService: PortfolioService,
  private walletService: WalletService,
  private authService: AuthService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const clientId = sessionStorage.getItem('clientId');
      if (clientId) {
        // Fetch portfolio positions
        this.portfolioService.getPortfolioPositions(clientId).subscribe({
          next: (response: any) => {
            const data = response.positions || [];
            this.rowData = data;
            this.calculateSummary();
          },
          error: (err) => {
            console.error('Failed to fetch portfolio:', err);
            this.rowData = [];
            this.calculateSummary();
          }
        });
        // Fetch wallet cash balance
        this.walletService.getWalletBalance(clientId).subscribe({

        next: (wallet: any) => {

          this.walletService.setCashBalance(wallet.cashBalance || 0);

        },

        error: () => {

          this.walletService.setCashBalance(0);

        }

      });

      this.walletService.cashBalance$.subscribe(balance => {

        this.cashRemaining = balance;

        this.calculateSummary();

      });

    } else {

      this.rowData = [];

      this.cashRemaining = 0;

      this.calculateSummary();

    }

  }

}

  onGridReady(params: any): void {
    params.api.sizeColumnsToFit();
  }

  private currencyFormatter(params: { value: number }): string {
    if (params.value == null) return '';
    return `$${params.value.toFixed(2)}`;
  }

  // Removed localStorage loading methods

  private calculateSummary(): void {
  let totalCostBasis = 0;
  this.rowData.forEach(item => {
    totalCostBasis +=  (item.cost || 0);
  });

  this.netWorth = this.cashRemaining + totalCostBasis;

  // Estimate gains as fixed % of total cost basis
  const estimatedReturnPercent = 0.05; // 5% assumed gain
  this.overallGains = totalCostBasis * estimatedReturnPercent;

  this.overallReturns = totalCostBasis > 0
    ? (estimatedReturnPercent * 100).toFixed(2) + '% (estimated)'
    : '0%';
}

}