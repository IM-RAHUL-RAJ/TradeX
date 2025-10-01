import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TradeDirection } from '../../core/models/trade.model';
import { environment } from '../../../environments/environment';
 
// Backend response interfaces
interface PortfolioPositionResponseDto {
  instrumentId: string;
  description: string;
  quantity: number;
  cost: number;
  clientId: string;
}
 
interface PortfolioReportDto {
  clientId: string;
  totalValue: number;
  cashBalance: number;
  positions: PortfolioPositionResponseDto[];
  reportGeneratedAt: string;
}
 
interface TradeResponseDto {
  tradeId: string;
  instrumentId: string;
  clientId: string;
  orderId: string;
  quantity: number;
  executionPrice: number;
  direction: TradeDirection;
  cashValue: number;
}
 
interface TradeHistoryReportDto {
  clientId: string;
  totalTrades: number;
  totalVolume: number;
  trades: TradeResponseDto[];
  reportGeneratedAt: string;
}
 
interface ReportData {
  [key: string]: any;
  id: string;
  type?: string;
  instrument?: string;
  description?: string;
  quantity?: number;
  price?: number;
  avgCost?: number;
  cashValue?: number;
  direction?: TradeDirection;
  date?: string;
  orderId?: string;
}
 
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  selectedReport: string = '';
  availableReports: string[] = [
    'Trade History Report',
    'Portfolio Summary Report'
  ];
  generatedReport: ReportData[] = [];
  message = '';
  loading = false;
  currentClientId = '';
 
  // API base URL (browser-facing host)
  private readonly API_BASE_URL = `${environment.apiUrl}/reports`;

 
  constructor(private http: HttpClient) {}
 
  ngOnInit(): void {
    // Get client ID from sessionStorage
    this.currentClientId = sessionStorage.getItem('clientId') || '';
 
    if (!this.currentClientId) {
      this.message = 'Client ID not found in session. Please log in again.';
      return;
    }
  }
 
  generateReport(): void {
    if (!this.selectedReport) {
      this.message = 'Please select a report.';
      this.generatedReport = [];
      return;
    }
 
    if (!this.currentClientId) {
      this.message = 'Client ID not found. Please log in again.';
      this.generatedReport = [];
      return;
    }
 
    this.loading = true;
    this.message = '';
    this.generatedReport = [];
 
    switch (this.selectedReport) {
      case 'Trade History Report':
        this.generateTradeHistoryReport();
        break;
      case 'Portfolio Summary Report':
        this.generatePortfolioSummaryReport();
        break;
      default:
        this.message = 'Invalid report selection.';
        this.generatedReport = [];
        this.loading = false;
    }
  }
 
  private generateTradeHistoryReport(): void {
  const url = `${this.API_BASE_URL}/trade-history/${this.currentClientId}`;
 
    this.http.get<TradeHistoryReportDto>(url).subscribe({
      next: (response) => {
        if (response && response.trades && response.trades.length > 0) {
          this.generatedReport = response.trades.map(trade => {
            // Convert direction to string for safe comparison
            const directionStr = String(trade.direction);
            let mappedDirection = directionStr;
            if (directionStr === 'BUY') {
              mappedDirection = 'B';
            } else if (directionStr === 'SELL') {
              mappedDirection = 'S';
            }
            let typeLabel = mappedDirection;
            if (mappedDirection === 'B') {
              typeLabel = 'Buy';
            } else if (mappedDirection === 'S') {
              typeLabel = 'Sell';
            }
            return {
              id: trade.tradeId,
              type: typeLabel,
              instrument: trade.instrumentId,
              orderId: trade.orderId,
              quantity: trade.quantity,
              price: trade.executionPrice,
              cashValue: trade.cashValue,
              date: new Date().toLocaleDateString()
            };
          });
 
          this.message = `Generated Trade History Report with ${this.generatedReport.length} records.`;
        } else {
          this.generatedReport = [];
          this.message = `No trade history data available.`;
        }
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching trade history:', error);
        this.message = `Error generating trade history report: ${error.message || 'Server error'}`;
        this.generatedReport = [];
        this.loading = false;
      }
    });
  }
 
  private generatePortfolioSummaryReport(): void {
    const url = `${this.API_BASE_URL}/portfolio/${this.currentClientId}`;
 
    this.http.get<PortfolioReportDto>(url).subscribe({
      next: (response) => {
        if (response && response.positions && response.positions.length > 0) {
          this.generatedReport = response.positions.map((position, index) => ({
            id: `P${(index + 1).toString().padStart(3, '0')}`,
            instrument: position.instrumentId,
            description: position.description,
            quantity: position.quantity,
            avgCost: position.cost,
            cashValue: position.quantity * position.cost
          }));
 
          this.message = `Generated Portfolio Report with ${this.generatedReport.length} positions.`;
        } else {
          this.generatedReport = [];
          this.message = `No portfolio data available.`;
        }
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching portfolio:', error);
        this.message = `Error generating portfolio report: ${error.message || 'Server error'}`;
        this.generatedReport = [];
        this.loading = false;
      }
    });
  }
 
  getTableHeaders(): string[] {
    if (!this.generatedReport || this.generatedReport.length === 0) return [];
 
    const firstRow = this.generatedReport[0];
    return Object.keys(firstRow).filter(key => 
      firstRow[key] !== undefined && 
      firstRow[key] !== null && 
      key !== 'clientId'
    );
  }
 
  objectValues(row: Record<string, any>): any[] {
    const headers = this.getTableHeaders();
    return headers.map(key => {
      const value = row[key];
      if (typeof value === 'number' && (
        key.includes('price') || 
        key.includes('cost') || 
        key.includes('cashValue') || 
        key.includes('avgCost')
      )) {
        return `$${value.toFixed(2)}`;
      }
      return value || '-';
    });
  }
 
  refreshReport(): void {
    if (this.selectedReport) {
      this.generateReport();
    }
  }
 
  clearReport(): void {
    this.selectedReport = '';
    this.generatedReport = [];
    this.message = 'Report cleared.';
  }
 
  exportReport(): void {
    if (this.generatedReport.length === 0) {
      this.message = 'No data to export.';
      return;
    }
 
    try {
      const headers = this.getTableHeaders();
      const csvContent = [
        headers.join(','),
        ...this.generatedReport.map(row => 
          headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
          }).join(',')
        )
      ].join('\n');
 
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.selectedReport.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
 
      this.message = 'Report exported successfully.';
    } catch (error) {
      console.error('Export error:', error);
      this.message = 'Error exporting report.';
    }
  }
 
  getTotalCashValue(): number {
    return this.generatedReport
      .filter(row => row.cashValue !== undefined)
      .reduce((sum, row) => sum + (row.cashValue || 0), 0);
  }
 
  getTotalRecords(): number {
    return this.generatedReport.length;
  }
 
  getReportSummary(): string {
    if (this.generatedReport.length === 0) return '';
 
    const totalRecords = this.getTotalRecords();
    const totalValue = this.getTotalCashValue();
 
    return `${totalRecords} records${totalValue > 0 ? `, Total Value: $${totalValue.toFixed(2)}` : ''}`;
  }
 
  // Simple helper methods for template
  formatHeaderName(header: string): string {
    return header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
 
  getCurrentDateTime(): string {
    return new Date().toLocaleString();
  }
}