import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <span>© 2025 TradeX</span>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #f5f5f5;
      padding: 1rem;
      text-align: center;
      font-size: 0.9rem;
      color: #666;
      position: fixed;
      width: 100%;
      bottom: 0;
    }
  `]
})
export class FooterComponent {}
