import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { environment } from '../../../environments/environment';

interface StockRecommendation {
  symbol: string;
  companyName: string;
  recommendation: string;
  targetPrice: number;
  reasoning: string;
  riskLevel: string;
  allocationPercentage: number;
}

interface PortfolioAnalysis {
  overallRisk: string;
  riskScore: number;
  diversificationLevel: string;
  riskFactors: string[];
  recommendations: string;
}

interface MarketInsights {
  marketTrend: string;
  sectorRecommendations: string;
  economicOutlook: string;
  keyInsights: string[];
}

interface RoboAdvisorResponse {
  clientId: string;
  stockRecommendations: StockRecommendation[];
  portfolioAnalysis: PortfolioAnalysis;
  marketInsights: MarketInsights;
  overallStrategy: string;
  generatedAt: string;
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-robo-advisor',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NavbarComponent, SidebarComponent],
  templateUrl: './robo-advisor.component.html',
  styleUrls: ['./robo-advisor.component.css']
})
export class RoboAdvisorComponent implements OnInit {

  // Client data
  currentClientId: string = '';
  
  // Loading states
  loading: boolean = false;
  recommendationsLoading: boolean = false;
  portfolioLoading: boolean = false;
  insightsLoading: boolean = false;

  // Data
  stockRecommendations: StockRecommendation[] = [];
  portfolioAnalysis: PortfolioAnalysis | null = null;
  marketInsights: MarketInsights | null = null;
  overallStrategy: string = '';

  // UI state
  activeTab: string = 'recommendations';
  message: string = '';
  messageType: string = 'info';
  lastUpdated: string = '';

  // API base URL
  private apiUrl = `${environment.apiUrl}/robo-advisor`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentClientId();
  }

  getCurrentClientId(): void {
    this.currentClientId = sessionStorage.getItem('clientId') || '';
    if (!this.currentClientId) {
      this.showMessage('Client ID not found in session. Please log in again.', 'error');
      return;
    }
  }

  // Get Stock Recommendations
  getStockRecommendations(): void {
    if (!this.currentClientId) {
      this.showMessage('Client ID not found. Please log in again.', 'error');
      return;
    }

    this.recommendationsLoading = true;
    this.showMessage('Generating AI-powered stock recommendations...', 'info');

    this.http.get<RoboAdvisorResponse>(`${this.apiUrl}/recommendations/${this.currentClientId}`)
      .subscribe({
        next: (response) => {
          this.recommendationsLoading = false;
          if (response.success) {
            this.stockRecommendations = response.stockRecommendations || [];
            this.overallStrategy = response.overallStrategy || '';
            this.lastUpdated = this.formatDateTime(response.generatedAt);
            this.showMessage(`Generated ${this.stockRecommendations.length} stock recommendations successfully!`, 'success');
            this.activeTab = 'recommendations';
          } else {
            this.showMessage(response.message || 'Failed to generate recommendations', 'error');
          }
        },
        error: (error) => {
          this.recommendationsLoading = false;
          this.handleError('Error generating stock recommendations', error);
        }
      });
  }

  // Get Portfolio Analysis
  getPortfolioAnalysis(): void {
    if (!this.currentClientId) {
      this.showMessage('Client ID not found. Please log in again.', 'error');
      return;
    }

    this.portfolioLoading = true;
    this.showMessage('Analyzing your portfolio risk profile...', 'info');

    this.http.get<RoboAdvisorResponse>(`${this.apiUrl}/portfolio-analysis/${this.currentClientId}`)
      .subscribe({
        next: (response) => {
          this.portfolioLoading = false;
          if (response.success) {
            this.portfolioAnalysis = response.portfolioAnalysis;
            this.lastUpdated = this.formatDateTime(response.generatedAt);
            this.showMessage('Portfolio analysis completed successfully!', 'success');
            this.activeTab = 'portfolio';
          } else {
            this.showMessage(response.message || 'Failed to analyze portfolio', 'error');
          }
        },
        error: (error) => {
          this.portfolioLoading = false;
          this.handleError('Error analyzing portfolio', error);
        }
      });
  }

  // Get Market Insights
  getMarketInsights(): void {
    if (!this.currentClientId) {
      this.showMessage('Client ID not found. Please log in again.', 'error');
      return;
    }

    this.insightsLoading = true;
    this.showMessage('Gathering latest market insights...', 'info');

    this.http.get<RoboAdvisorResponse>(`${this.apiUrl}/market-insights/${this.currentClientId}`)
      .subscribe({
        next: (response) => {
          this.insightsLoading = false;
          if (response.success) {
            this.marketInsights = response.marketInsights;
            this.lastUpdated = this.formatDateTime(response.generatedAt);
            this.showMessage('Market insights updated successfully!', 'success');
            this.activeTab = 'insights';
          } else {
            this.showMessage(response.message || 'Failed to get market insights', 'error');
          }
        },
        error: (error) => {
          this.insightsLoading = false;
          this.handleError('Error getting market insights', error);
        }
      });
  }

  // Get All AI Insights
  getAllInsights(): void {
    this.loading = true;
    this.showMessage('Generating comprehensive AI analysis...', 'info');
    
    // Call all three APIs in sequence
    this.getStockRecommendations();
    setTimeout(() => this.getPortfolioAnalysis(), 1000);
    setTimeout(() => this.getMarketInsights(), 2000);
    
    setTimeout(() => {
      this.loading = false;
      if (this.stockRecommendations.length > 0 || this.portfolioAnalysis || this.marketInsights) {
        this.showMessage('Complete AI analysis generated successfully!', 'success');
      }
    }, 3000);
  }

  // Tab navigation
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Utility methods
  showMessage(text: string, type: string): void {
    this.message = text;
    this.messageType = type;
    
    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        this.message = '';
      }, 5000);
    }
  }

  clearMessage(): void {
    this.message = '';
  }

  handleError(context: string, error: any): void {
    console.error(`${context}:`, error);
    let errorMessage = `${context}: `;
    
    if (error.error?.message) {
      errorMessage += error.error.message;
    } else if (error.message) {
      errorMessage += error.message;
    } else {
      errorMessage += 'An unexpected error occurred';
    }
    
    this.showMessage(errorMessage, 'error');
  }

  formatDateTime(dateTime: string): string {
    if (!dateTime) return '';
    try {
      return new Date(dateTime).toLocaleString();
    } catch {
      return dateTime;
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  // Navigation
  goToPreferences(): void {
    this.router.navigate(['/preferences']);
  }

  refreshData(): void {
    this.stockRecommendations = [];
    this.portfolioAnalysis = null;
    this.marketInsights = null;
    this.overallStrategy = '';
    this.lastUpdated = '';
    this.getAllInsights();
  }

  // Export functionality
  exportRecommendations(): void {
    if (this.stockRecommendations.length === 0) {
      this.showMessage('No recommendations to export', 'warning');
      return;
    }

    try {
      const headers = ['Symbol', 'Company', 'Recommendation', 'Target Price', 'Risk Level', 'Allocation %', 'Reasoning'];
      const csvContent = [
        headers.join(','),
        ...this.stockRecommendations.map(rec => [
          rec.symbol,
          `"${rec.companyName}"`,
          rec.recommendation,
          rec.targetPrice,
          rec.riskLevel,
          rec.allocationPercentage,
          `"${rec.reasoning}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `robo-advisor-recommendations-${this.currentClientId}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      this.showMessage('Recommendations exported successfully!', 'success');
    } catch (error) {
      this.showMessage('Error exporting recommendations', 'error');
    }
  }
}
