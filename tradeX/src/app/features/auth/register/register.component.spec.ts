import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ClientService } from '../../../core/services/client/client.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    clientServiceSpy = jasmine.createSpyObj('ClientService', ['verifyClient']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);
    routerSpy.getCurrentNavigation.and.returnValue({
      id: 1,
      initialUrl: {} as any,
      extractedUrl: {} as any,
      trigger: 'imperative',
      extras: { state: { email: null } },
      previousNavigation: null
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterComponent],
      providers: [
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        FormBuilder
      ]
    }).compileComponents();

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false
    }));

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.registerForm.valid).toBeFalse();
  });

  it('should mark form as invalid with bad data', () => {
    component.registerForm.setValue({
      email: 'bad-email',
      newPassword: '123',
      confirmPassword: '321',
      dateOfBirth: '',
      country: '',
      postalCode: '',
      idType: '',
      idValue: ''
    });
    expect(component.registerForm.valid).toBeFalse();
  });

  it('should show success and navigate on successful registration', async () => {
    component.registerForm.setValue({
      email: 'newuser@example.com',
      newPassword: 'ValidPass1!',
      confirmPassword: 'ValidPass1!',
      dateOfBirth: '1990-01-01',
      country: 'Canada',
      postalCode: 'A1B2C3',
      idType: 'PAN',
      idValue: 'ABCDE1234F'
    });

  clientServiceSpy.verifyClient.and.returnValue(of({ success: true, message: 'Registration successful', clientId: 'C123' }));
    await component.onRegister();

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'success',
      title: 'Registration Successful',
      text: 'Your client ID is C123'
    }));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/preferences'], { state: { clientId: 'C123' } });
  });

  it('should show error if registration fails (no clientId)', async () => {
    component.registerForm.setValue({
      email: 'failuser@example.com',
      newPassword: 'ValidPass1!',
      confirmPassword: 'ValidPass1!',
      dateOfBirth: '1990-01-01',
      country: 'Canada',
      postalCode: 'A1B2C3',
      idType: 'PAN',
      idValue: 'ABCDE1234F'
    });

  clientServiceSpy.verifyClient.and.returnValue(of({ success: false, message: 'Registration failed', clientId: undefined }));
    await component.onRegister();

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error',
      title: 'Registration Failed',
      text: 'Registration failed. Please try again.'
    }));
  });

  it('should show error if verifyClient throws', async () => {
    component.registerForm.setValue({
      email: 'erroruser@example.com',
      newPassword: 'ValidPass1!',
      confirmPassword: 'ValidPass1!',
      dateOfBirth: '1990-01-01',
      country: 'Canada',
      postalCode: 'A1B2C3',
      idType: 'PAN',
      idValue: 'ABCDE1234F'
    });

    clientServiceSpy.verifyClient.and.returnValue(throwError(() => ({ error: { message: 'Server error' } })));
    await component.onRegister();

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error',
      title: 'Registration Failed',
      text: 'Server error'
    }));
  });

  it('should not submit if form is invalid', async () => {
    component.registerForm.setValue({
      email: '',
      newPassword: '',
      confirmPassword: '',
      dateOfBirth: '',
      country: '',
      postalCode: '',
      idType: '',
      idValue: ''
    });
    spyOn(component.registerForm, 'markAllAsTouched');
    await component.onRegister();
    expect(component.registerForm.markAllAsTouched).toHaveBeenCalled();
  });
});