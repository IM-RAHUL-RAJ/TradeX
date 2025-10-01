import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, HttpClientModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  
  menuItems = [
    { label: 'Portfolio', route: '/portfolio' },
    { label: 'Trade', route: '/trade' },
    { label: 'Trade History', route: '/trade-history' },
    { label: 'Reports', route: '/reports' }
  ];

  companyName = 'TradeX';
  
  // ✅ Add this property to fix the error
  showRoboAdvisor = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkRoboAdvisorStatus();
  }

  private checkRoboAdvisorStatus(): void {
    const clientId = sessionStorage.getItem('clientId');
    
    if (!clientId) {
      this.showRoboAdvisor = false;
      return;
    }

    // Call preferences API to check robo advisor status
  this.http.get<any>(`${environment.apiUrl}/preferences/${clientId}`)
      .subscribe({
        next: (preferences) => {
          this.showRoboAdvisor = preferences?.roboAdvisor === true;
        },
        error: () => {
          this.showRoboAdvisor = false;
        }
      });
  }
}
