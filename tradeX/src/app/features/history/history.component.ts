import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TradeService } from '../../core/services/trade/trade.service';

// Mock interface for Trade (adjust fields as needed)
export interface Trade {
  tradeId: string;
  date: string | Date;
  direction: string;
  instrumentId: string;
  quantity: number;
  executionPrice: number;
  cashValue: number;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, AgGridModule,NavbarComponent,SidebarComponent],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  rowData: Trade[] = [];
  isBrowser = false;

  columnDefs: ColDef[] = [
    { headerName: 'Trade ID', field: 'tradeId', sortable: true, filter: true },
    { 
      headerName: 'Direction', 
      field: 'direction', 
      sortable: true, 
      filter: true, 
      valueFormatter: this.directionFormatter.bind(this) 
    },
    { headerName: 'Instrument', field: 'instrumentId', sortable: true, filter: true },
    { 
      headerName: 'Quantity', 
      field: 'quantity', 
      sortable: true, 
      filter: 'agNumberColumnFilter', 
      type: 'rightAligned' 
    },
    { 
      headerName: 'Execution Price', 
      field: 'executionPrice', 
      sortable: true, 
      filter: 'agNumberColumnFilter', 
      type: 'rightAligned', 
      valueFormatter: this.currencyFormatter.bind(this) 
    },
    { 
      headerName: 'Cash Value', 
      field: 'cashValue', 
      sortable: true, 
      filter: 'agNumberColumnFilter', 
      type: 'rightAligned', 
      valueFormatter: this.currencyFormatter.bind(this) 
    }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    resizable: true
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private tradeService: TradeService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    const clientId = sessionStorage.getItem('clientId');
    if (clientId) {
      this.tradeService.getTradeHistory(clientId).subscribe({
        next: (response: any) => {
          // Map direction from 'BUY'/'SELL' to 'B'/'S' for frontend
          const trades = (response.trades || []).map((trade: any) => ({
            ...trade,
            direction: trade.direction === 'BUY' ? 'B' : (trade.direction === 'SELL' ? 'S' : trade.direction),
            cashValue: Number(trade.quantity) * Number(trade.executionPrice)
          }));
          this.rowData = trades;
          console.log('Trade history from backend:', this.rowData);
        },
        error: (err) => {
          console.error('Failed to fetch trade history:', err);
          this.rowData = [];
        }
      });
    } else {
      this.rowData = [];
    }
  }


  onGridReady(params: any) {
    console.log('Grid ready:', params.api.getDisplayedRowCount(), 'rows');
    params.api.sizeColumnsToFit();  // Optional: auto-fit columns to grid width
  }

  private currencyFormatter(params: any): string {
    if (params.value == null) return '';
    return `$${params.value.toFixed(2)}`;
  }

  private dateFormatter(params: any): string {
    if (!params.value) return '';
    return new Date(params.value).toLocaleString();
  }

  private directionFormatter(params: any): string {
    return params.value === 'B' ? 'Buy' : 'Sell';
  }

  // private getMockTradeHistory(): Trade[] {
  //   return [
  //     {
  //       tradeId: 'T1234',
  //       date: new Date('2023-07-01T10:15:00'),
  //       direction: 'B',
  //       instrumentId: 'AAPL',
  //       quantity: 50,
  //       executionPrice: 145.5,
  //       cashValue: 7275
  //     },
  //     {
  //       tradeId: 'T1235',
  //       date: new Date('2023-07-05T15:30:00'),
  //       direction: 'S',
  //       instrumentId: 'TSLA',
  //       quantity: 10,
  //       executionPrice: 695.0,
  //       cashValue: 6950
  //     },
  //     {
  //       tradeId: 'T1236',
  //       date: new Date('2023-07-10T11:00:00'),
  //       direction: 'B',
  //       instrumentId: 'GOOGL',
  //       quantity: 20,
  //       executionPrice: 2520.5,
  //       cashValue: 50410
  //     }
  //   ];
  //}
}
