import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="logo-placeholder">
        <img src="tradeXlogo.png" alt="Logo" />
        <span class="app-name">TradeX</span>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: #0056bff0; /* blue background */
      padding: 1rem;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    .logo-placeholder {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
      font-weight: bold;
      font-size: 1.5rem;
    }
    .logo-placeholder img {
      height: 40px;
      width: 40px;
      background: white;
      border-radius: 5px;
    }
  `]
})
export class HeaderComponent {}
