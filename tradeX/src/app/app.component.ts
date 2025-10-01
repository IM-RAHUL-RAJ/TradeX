import { Component, NgModule } from '@angular/core';
import { PortfolioComponent } from './features/portfolio/portfolio.component';
import { HistoryComponent } from './features/history/history.component';
import { RouterOutlet } from '@angular/router';
import { TradeBuyComponent } from './features/trade-buy/trade-buy.component';
import { HttpClientModule } from '@angular/common/http';
// import { PreferencesComponent } from "./features/preferences/preferences.component";
import { LoginPageComponent } from './features/auth/login/login.component';
import { EmailVerificationComponent } from "./features/email-verification/email-verification.component";
import { RegisterComponent } from './features/auth/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,PortfolioComponent,HistoryComponent,ReactiveFormsModule,LoginPageComponent,TradeBuyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
