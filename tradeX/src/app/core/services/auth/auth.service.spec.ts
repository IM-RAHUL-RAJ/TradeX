import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false for isAuthenticated initially', () => {
    expect(service.isAuthenticated()).toBeFalse();
    localStorage.setItem('loggedIn', 'false');
    expect(service.isAuthenticated()).toBeFalse();
    localStorage.removeItem('loggedIn');
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should return null for current user initially', () => {
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should set logged in state and user email on login', () => {
    service.login('test@example.com');
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getCurrentUser()).toBe('test@example.com');
  });

  it('should reset logged in state and current user on logout', () => {
    service.login('test@example.com');
    service.logout();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
  });
});
