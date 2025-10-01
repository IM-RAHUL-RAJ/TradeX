import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { WalletService } from '../../../core/services/wallet/wallet.service';
import { MatIconModule } from '@angular/material/icon';

import { WalletDialogComponent } from '../../../features/wallet-dialog/wallet-dialog.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userName = 'John Doe'; // You can bind dynamically from your auth/user service
  emailFromState: string = "";
  userAvatar: string = ''; // Add user avatar URL here if available
  searchQuery: string = '';
  isDropdownOpen: boolean = false;
  notificationCount: number = 3; // Example notification count

  cashBalance: number = 0; // Wallet cash balance

  constructor(private router: Router, private dialog: MatDialog, private walletService: WalletService) {
    const nav = this.router.getCurrentNavigation();
    this.emailFromState = nav?.extras?.state?.['email'] ?? 'user@tradex.com';
  }

ngOnInit(): void {
    this.loadUserData();

    const clientId = sessionStorage.getItem('clientId');
    if (clientId) {
      this.walletService.getWalletBalance(clientId).subscribe({
        next: (wallet) => this.walletService.setCashBalance(wallet.cashBalance || 0),
        error: () => this.walletService.setCashBalance(0)
      });
    }
    this.walletService.cashBalance$.subscribe(balance => {
      this.cashBalance = balance;
    });
  }

  // Load user data from your auth service
  private loadUserData(): void {
    // Example: You can load user data from your auth service here
    // this.authService.getCurrentUser().subscribe(user => {
    //   this.userName = user.name;
    //   this.emailFromState = user.email;
    //   this.userAvatar = user.avatar;
    // });
  }

  // Get user initials for avatar placeholder
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  // Toggle dropdown menu
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Close dropdown menu
  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  // Handle search functionality
  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // Implement your search logic here
      // this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  // Navigation methods
  navigateToPreferences(): void {
    this.closeDropdown();
    console.log('Navigating to preferences with email:', this.emailFromState);
    this.router.navigate(['/preferences'], { 
      state: { email: this.emailFromState.trim() } 
    });
  }

  navigateToProfile(): void {
    this.closeDropdown();
    this.router.navigate(['/profile']);
  }

  navigateToHelp(): void {
    this.closeDropdown();
    this.router.navigate(['/help']);
  }

  // Logout functionality
  logout(): void {
    this.closeDropdown();

    // Clear any stored user data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userEmail');
    sessionStorage.clear();

    // Optional: Call your auth service logout method
    // this.authService.logout().subscribe(() => {
    //   this.router.navigate(['/login']);
    // });

    console.log('User logged out');
    this.router.navigate(['/login']);
  }

  // Handle notification click
  onNotificationClick(): void {
    console.log('Notifications clicked');
    // Implement notification logic
    // this.router.navigate(['/notifications']);
  }

  openWalletModal(): void {
  const dialogRef = this.dialog.open(WalletDialogComponent, {
    width: '400px',
    data: { initialBalance: this.cashBalance }
  });

  // No need to subscribe to afterClosed for balance update
}

  // Listen for clicks outside dropdown to close it
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const dropdownElement = target.closest('.user-profile');

    if (!dropdownElement && this.isDropdownOpen) {
      this.closeDropdown();
    }
  }

  // Handle keyboard navigation
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKeyDown(event: KeyboardEvent): void {
    if (this.isDropdownOpen) {
      this.closeDropdown();
    }
  }
}
 