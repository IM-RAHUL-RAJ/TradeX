import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPageComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../../core/services/client/client.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    clientServiceSpy = jasmine.createSpyObj('ClientService', ['loginAndGetClientId']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginPageComponent],
      providers: [
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false
    }));

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create LoginPageComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('validateEmail()', () => {
    it('should return true for valid email', () => {
      expect(component.validateEmail('user@example.com')).toBeTrue();
    });

    it('should return false for invalid email', () => {
      expect(component.validateEmail('invalid-email')).toBeFalse();
      expect(component.validateEmail('')).toBeFalse();
      expect(component.validateEmail(null as any)).toBeFalse();
    });
  });

  describe('onSubmit()', () => {
    it('should not submit if form is invalid', async () => {
      component.loginForm.setValue({ email: '', password: '' });
      spyOn(component.loginForm, 'markAllAsTouched');
      await component.onSubmit();
      expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should process successful login', async () => {
      component.loginForm.setValue({ email: 'found@example.com', password: 'ValidPass123!' });
      clientServiceSpy.loginAndGetClientId.and.returnValue(of('C001'));
      await component.onSubmit();
      expect(authServiceSpy.login).toHaveBeenCalledWith('found@example.com');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/portfolio'], { state: { email: 'found@example.com' } });
    });

    it('should show error on failed login', async () => {
      component.loginForm.setValue({ email: 'notfound@example.com', password: 'anyPass' });
      clientServiceSpy.loginAndGetClientId.and.returnValue(throwError(() => ({ error: { message: 'Invalid credentials.' } })));
      await component.onSubmit();
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid credentials.'
      }));
    });
  });
});