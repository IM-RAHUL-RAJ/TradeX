
import { Routes } from '@angular/router';
import { PortfolioComponent } from './features/portfolio/portfolio.component';
import { TradeBuyComponent } from './features/trade-buy/trade-buy.component';
//import { TradeSellComponent } from './features/trade-sell/trade-sell.component';
import { HistoryComponent } from './features/history/history.component';
import { LoginPageComponent } from './features/auth/login/login.component';
import { EmailVerificationComponent } from './features/email-verification/email-verification.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { PreferencesComponent } from './features/preferences/preferences.component';
//import { RoboAdvisorComponent } from './features/robo-advisor/robo-advisor.component';
//import { ReportsComponent } from './features/reports/reports.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AuthGuard } from './core/guards/auth.guard'; // <-- Import the guard
import { LogoutGuard } from './core/guards/logout.guard';
import { ReportsComponent } from './features/reports/reports.component';
import { RoboAdvisorComponent } from './features/robo-advisor/robo-advisor.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent, canActivate: [LogoutGuard] },
  { path: 'login', component: LoginPageComponent, canActivate: [LogoutGuard] },
  { path: 'registration', component: RegisterComponent },
  { path: 'email-verification', component: EmailVerificationComponent },
  { path: 'preferences', component: PreferencesComponent},
  { path: 'navbar', component: NavbarComponent, canActivate: [AuthGuard] },
  { path: 'portfolio', component: PortfolioComponent, canActivate: [AuthGuard] },
  { path: 'trade', component: TradeBuyComponent, canActivate: [AuthGuard] },
  { path: 'trade-history', component: HistoryComponent, canActivate: [AuthGuard] },
  //{ path: 'activity', component: TradeSellComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'robo-advisor', component: RoboAdvisorComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'portfolio' }
];
 