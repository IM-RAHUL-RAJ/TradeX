import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';

import { NavbarComponent } from './navbar.component';
import { WalletService } from '../../../core/services/wallet/wallet.service';

describe('NavbarComponent', () => {
  // Mock localStorage and sessionStorage globally for all tests
  const localStorageMock = {
    removeItem: jasmine.createSpy('removeItem'),
    setItem: jasmine.createSpy('setItem'),
    getItem: jasmine.createSpy('getItem'),
    clear: jasmine.createSpy('clear')
  };
  const sessionStorageMock = {
    clear: jasmine.createSpy('clear')
  };

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
    Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock, writable: true });
  });

  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockWalletService: jasmine.SpyObj<WalletService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockWalletService = jasmine.createSpyObj('WalletService', ['getWalletBalance', 'cashBalance$']);

    mockRouter.getCurrentNavigation.and.returnValue({
      extras: {
        state: { email: 'test@tradex.com' }
      }
    } as any);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, CommonModule, FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },
        { provide: WalletService, useValue: mockWalletService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.userName).toBe('John Doe');
    expect(component.emailFromState).toBe('test@tradex.com');
    expect(component.userAvatar).toBe('');
    expect(component.searchQuery).toBe('');
    expect(component.isDropdownOpen).toBe(false);
  });

  it('should render welcome message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hello')?.textContent).toContain('Welcome back!');
  });

  it('should render search input with correct placeholder', () => {
    const searchInput = fixture.nativeElement.querySelector('.search-input') as HTMLInputElement;
    expect(searchInput).toBeTruthy();
    expect(searchInput.placeholder).toBe('Search stocks, portfolio...');
  });

  it('should render user avatar with initials', () => {
    const avatarPlaceholder = fixture.nativeElement.querySelector('.avatar-placeholder');
    expect(avatarPlaceholder).toBeTruthy();
    expect(avatarPlaceholder?.textContent?.trim()).toBe('JD'); // John Doe initials
  });

  describe('getInitials', () => {
    it('should return correct initials for single name', () => {
      expect(component.getInitials('John')).toBe('J');
    });

    it('should return correct initials for two names', () => {
      expect(component.getInitials('John Doe')).toBe('JD');
    });

    it('should return correct initials for three names', () => {
      expect(component.getInitials('John Michael Doe')).toBe('JM');
    });

    it('should handle empty string', () => {
      expect(component.getInitials('')).toBe('');
    });
  });

  describe('dropdown functionality', () => {
    it('should toggle dropdown when avatar is clicked', () => {
      const avatarButton = fixture.nativeElement.querySelector('.user-avatar') as HTMLButtonElement;
      expect(component.isDropdownOpen).toBe(false);

      avatarButton.click();
      fixture.detectChanges();
      expect(component.isDropdownOpen).toBe(true);

      avatarButton.click();
      fixture.detectChanges();
      expect(component.isDropdownOpen).toBe(false);
    });

    it('should show dropdown menu when isDropdownOpen is true', () => {
      component.isDropdownOpen = true;
      fixture.detectChanges();

      const dropdownMenu = fixture.nativeElement.querySelector('.dropdown-menu');
      expect(dropdownMenu).toBeTruthy();
    });

    it('should hide dropdown menu when isDropdownOpen is false', () => {
      component.isDropdownOpen = false;
      fixture.detectChanges();

      const dropdownMenu = fixture.nativeElement.querySelector('.dropdown-menu');
      expect(dropdownMenu).toBeFalsy();
    });

    it('should close dropdown when closeDropdown is called', () => {
      component.isDropdownOpen = true;
      component.closeDropdown();
      expect(component.isDropdownOpen).toBe(false);
    });
  });

  describe('search functionality', () => {
    it('should call onSearch when search button is clicked', () => {
      spyOn(component, 'onSearch');
      const searchButton = fixture.nativeElement.querySelector('.search-button') as HTMLButtonElement;
      searchButton.click();
      expect(component.onSearch).toHaveBeenCalled();
    });

    it('should call onSearch when Enter key is pressed in search input', () => {
      spyOn(component, 'onSearch');
      const searchInput = fixture.nativeElement.querySelector('.search-input') as HTMLInputElement;
      const enterEvent = new KeyboardEvent('keyup', { key: 'Enter' });
      searchInput.dispatchEvent(enterEvent);
      expect(component.onSearch).toHaveBeenCalled();
    });

    it('should log search query when onSearch is called with valid query', () => {
      spyOn(console, 'log');
      component.searchQuery = 'test search';
      component.onSearch();
      expect(console.log).toHaveBeenCalledWith('Searching for:', 'test search');
    });

    it('should not log when onSearch is called with empty query', () => {
      spyOn(console, 'log');
      component.searchQuery = '';
      component.onSearch();
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('navigation methods', () => {
    beforeEach(() => {
      spyOn(component, 'closeDropdown');
    });

    it('should navigate to preferences and close dropdown', () => {
      component.navigateToPreferences();
      expect(component.closeDropdown).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/preferences'], { state: { email: 'test@tradex.com' } });
    });

    it('should navigate to profile and close dropdown', () => {
      component.navigateToProfile();
      expect(component.closeDropdown).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('should navigate to help and close dropdown', () => {
      component.navigateToHelp();
      expect(component.closeDropdown).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/help']);
    });
  });

  describe('logout functionality', () => {
    beforeEach(() => {
      spyOn(component, 'closeDropdown');
      spyOn(console, 'log');
    });

    it('should clear storage and navigate to login on logout', () => {
      component.logout();
      expect(component.closeDropdown).toHaveBeenCalled();
      expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(localStorage.removeItem).toHaveBeenCalledWith('userData');
      expect(sessionStorage.clear).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('User logged out');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('event listeners', () => {
    it('should close dropdown when clicking outside', () => {
      component.isDropdownOpen = true;
      const outsideElement = document.createElement('div');
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: outsideElement });
      component.onDocumentClick(clickEvent);
      expect(component.isDropdownOpen).toBe(false);
    });

    it('should not close dropdown when clicking inside user profile', () => {
      component.isDropdownOpen = true;
      const userProfileElement = fixture.nativeElement.querySelector('.user-profile');
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: userProfileElement });
      component.onDocumentClick(clickEvent);
      expect(component.isDropdownOpen).toBe(true);
    });

    it('should close dropdown when Escape key is pressed', () => {
      component.isDropdownOpen = true;
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onEscapeKeyDown(escapeEvent);
      expect(component.isDropdownOpen).toBe(false);
    });
  });

  describe('dropdown menu items', () => {
    beforeEach(() => {
      component.isDropdownOpen = true;
      fixture.detectChanges();
    });

    it('should display user name and email in dropdown header', () => {
      const userName = fixture.nativeElement.querySelector('.user-name');
      const userEmail = fixture.nativeElement.querySelector('.user-email');
      expect(userName?.textContent?.trim()).toBe('John Doe');
      expect(userEmail?.textContent?.trim()).toBe('test@tradex.com');
    });

    it('should call navigateToProfile when Profile Settings is clicked', () => {
      spyOn(component, 'navigateToProfile');
      const profileItem = fixture.debugElement.query(By.css('.dropdown-item')).nativeElement;
      profileItem.click();
      expect(component.navigateToProfile).toHaveBeenCalled();
    });

    it('should call logout when Logout item is clicked', () => {
      spyOn(component, 'logout');
      const logoutItem = fixture.nativeElement.querySelector('.logout-item');
      logoutItem.click();
      expect(component.logout).toHaveBeenCalled();
    });
  });

  describe('component lifecycle', () => {
    it('should call loadUserData on ngOnInit', () => {
      spyOn(component, 'loadUserData' as any);
      component.ngOnInit();
      expect(component['loadUserData']).toHaveBeenCalled();
    });
  });

  describe('email handling', () => {
    it('should use default email when navigation state is null', () => {
      mockRouter.getCurrentNavigation.and.returnValue(null);
      const newComponent = new NavbarComponent(mockRouter, mockDialog, mockWalletService);
      expect(newComponent.emailFromState).toBe('user@tradex.com');
    });

    it('should use email from navigation state when available', () => {
      mockRouter.getCurrentNavigation.and.returnValue({
        extras: {
          state: { email: 'custom@email.com' }
        }
      } as any);
      const newComponent = new NavbarComponent(mockRouter, mockDialog, mockWalletService);
      expect(newComponent.emailFromState).toBe('custom@email.com');
    });
  });
});
 