import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class LogoutGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(): boolean {
    this.authService.logout();
    return true;
  }
}