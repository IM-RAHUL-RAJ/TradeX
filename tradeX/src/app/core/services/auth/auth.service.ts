import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserEmail: string | null = null;

  // Add this method
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  login(email: string) {
    if (this.isBrowser()) {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('userEmail', email);
    }
    this.currentUserEmail = email;
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('userEmail');
      //localStorage.removeItem('clientId'); // Clear clientId on logout
    }
    this.currentUserEmail = null;
  }

  isAuthenticated(): boolean {
    if (this.isBrowser()) {
    const loggedIn = localStorage.getItem('loggedIn');
    return loggedIn !== null && loggedIn === 'true';
    }
    return false;
  }

  getCurrentUser(): string | null {
    if (!this.currentUserEmail && this.isBrowser()) {
      this.currentUserEmail = localStorage.getItem('userEmail');
    }
    return this.currentUserEmail;
  }
}