import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TradeService } from '../../core/services/trade/trade.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { InstrumentsService } from '../../core/services/instruments/instruments.service';
import { WalletService } from '../../core/services/wallet/wallet.service';
import { PortfolioService } from '../../core/services/portfolio/portfolio.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-trade-buy',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    SidebarComponent,
    NavbarComponent
  ],
  templateUrl: './trade-buy.component.html',
  styleUrls: ['./trade-buy.component.css']
})
export class TradeBuyComponent implements OnInit {
  instruments: any[] = [];
  categories: string[] = [];
  filteredInstrumentList: any[] = [];
  selectedCategory = '';
  searchTerm = '';
  selectedInstrument: any = null;

  @ViewChild('tradeDialog') tradeDialogTpl!: TemplateRef<any>;
  quantity = 0;
  tradePrice = 0; // Ask for Buy, Bid for Sell
  totalPrice = 0;
  popupMode: 'buy' | 'sell' = 'buy';

  tradeErrorMessage = ''; // Holds error message for display

  cashBalance: number = 0; // Track available cash balance

  constructor(
    private instrumentsService: InstrumentsService,
    private tradeService: TradeService,
    private walletService: WalletService,
    private portfolioService: PortfolioService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadInstruments();
    this.fetchCashBalance();
  }

  fetchCashBalance(): void {
    const clientId = sessionStorage.getItem('clientId') || '';
    if (!clientId) return;
    this.walletService.getWalletBalance(clientId).subscribe({
      next: (res) => {
        this.cashBalance = res.cashBalance;
      },
      error: () => {
        this.cashBalance = 0;
      }
    });
  }

  loadInstruments(): void {
    this.instrumentsService.getInstruments().subscribe(data => {
      this.instruments = data;
      this.categories = [...new Set(data.map((i: any) => i.categoryId))];
      this.filteredInstrumentList = [...this.instruments];
    });
  }

  onCategoryChange(): void {
    this.searchTerm = '';
    this.selectedInstrument = null;
    this.filterInstruments();
  }

  onInstrumentSearchChange(): void {
    this.filterInstruments();
  }

  filterInstruments(): void {
    this.filteredInstrumentList = this.instruments.filter(i =>
      (this.selectedCategory ? i.categoryId === this.selectedCategory : true) &&
      (this.searchTerm
        ? i.instrumentDescription.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true)
    );
  }

  onInstrumentSelect(instrId: string): void {
    if (instrId) {
      this.searchTerm =
        this.instruments.find(i => i.instrumentId === instrId)?.instrumentDescription || '';
      this.instrumentsService.getInstrumentWithPrice(instrId).subscribe(data => {
        this.selectedInstrument = data;
      });
    } else {
      this.selectedInstrument = null;
    }
  }

  clearInstrumentSearch(): void {
    this.searchTerm = '';
    this.filteredInstrumentList = this.instruments.filter(i =>
      this.selectedCategory ? i.categoryId === this.selectedCategory : true
    );
    this.selectedInstrument = null;
  }

  openTradeDialog(mode: 'buy' | 'sell'): void {
    if (!this.selectedInstrument) return;
    this.quantity = 0;
    this.tradePrice = mode === 'buy'
      ? this.selectedInstrument.askPrice
      : this.selectedInstrument.bidPrice;
    this.totalPrice = 0;
    this.popupMode = mode;
    this.tradeErrorMessage = ''; // clear any old error message when dialog opens
    this.dialog.open(this.tradeDialogTpl);
  }

  calculateTotal(): void {
  if (this.quantity <= 0) {
    this.totalPrice = 0; // Prevent negative/zero total
    return;
  }
  this.totalPrice = this.quantity * this.tradePrice;
}





  tradeAction(): void {
    this.tradeErrorMessage = '';
    if (this.quantity <= 0) {
      this.tradeErrorMessage = 'Quantity must be greater than 0.';
      return;
    }
    if (this.popupMode === 'buy' && this.totalPrice > this.cashBalance) {
      this.tradeErrorMessage = 'Insufficient cash to buy this quantity.';
      return;
    }

    // SELL: Check if user owns enough quantity for this instrument
    if (this.popupMode === 'sell') {
      const clientId = sessionStorage.getItem('clientId') || 'guest';
      const instrumentId = this.selectedInstrument.instrument.instrumentId.trim().toUpperCase();
      this.portfolioService.getPortfolioPositions(clientId).subscribe({
        next: (positions) => {
          let normalizedPositions: any[] = [];
          if (Array.isArray(positions)) {
            normalizedPositions = positions;
          } else if (positions && Array.isArray((positions as any).positions)) {
            normalizedPositions = (positions as any).positions;
          }
          console.log('Fetched positions for sell:', normalizedPositions);
          console.log('InstrumentId to match:', instrumentId);
          const position = normalizedPositions.find((p: any) => {
            const posId = (p.instrumentId || '').trim().toUpperCase();
            console.log('Comparing position:', p, 'Normalized instrumentId:', posId);
            return posId === instrumentId;
          });
          let ownedQty = 0;
          if (position && position.quantity != null) {
            ownedQty = typeof position.quantity === 'string' ? parseFloat(position.quantity) : Number(position.quantity);
            if (isNaN(ownedQty) || ownedQty < 0) ownedQty = 0;
          }
          console.log('Matched position:', position, 'Owned quantity:', ownedQty);
          if (ownedQty <= 0) {
            this.tradeErrorMessage = `Cannot sell. You do not own any of this stock.`;
            return;
          }
          if (this.quantity > ownedQty) {
            this.tradeErrorMessage = `Cannot sell more than you own. Owned: ${ownedQty}`;
            return;
          }
          // If valid, proceed with trade
          this.executeTradeRequest(clientId, instrumentId);
        },
        error: () => {
          this.tradeErrorMessage = 'Could not fetch portfolio positions.';
        }
      });
      return; // Prevent further execution until async check completes
    }

    // BUY: Directly execute trade
    const clientId = sessionStorage.getItem('clientId') || 'guest';
    const instrumentId = this.selectedInstrument.instrument.instrumentId;
    this.executeTradeRequest(clientId, instrumentId);
  }

  private executeTradeRequest(clientId: string, instrumentId: string): void {
    const tradeRequest = {
      orderId: '',
      instrumentId: instrumentId,
      clientId: clientId,
      quantity: this.quantity,
      targetPrice: this.tradePrice,
      direction: this.popupMode === 'buy' ? 'BUY' : 'SELL'
    };

    const token = sessionStorage.getItem('token') ?? '';
    this.tradeService.executeTrade(tradeRequest, token).subscribe({
      next: () => {
        this.fetchCashBalance();
        this.closeDialog();
      },
      error: (err) => {
        this.tradeErrorMessage = err?.error?.message || 'Trade failed. Please try again.';
      }
    });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
