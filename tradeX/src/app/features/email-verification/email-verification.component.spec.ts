import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailVerificationComponent } from './email-verification.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

describe('EmailVerificationComponent', () => {
  let component: EmailVerificationComponent;
  let fixture: ComponentFixture<EmailVerificationComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EmailVerificationComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false
    }));

    fixture = TestBed.createComponent(EmailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('validateEmail()', () => {
    it('should return false for invalid email', () => {
      expect(component.validateEmail('invalid-email')).toBeFalse();
      expect(component.validateEmail('user..test@example.com')).toBeFalse();
      expect(component.validateEmail('user@-domain.com')).toBeFalse();
      expect(component.validateEmail('user@domain-.com')).toBeFalse();
      expect(component.validateEmail('user@domain..com')).toBeFalse();
      expect(component.validateEmail('a'.repeat(65) + '@example.com')).toBeFalse();
    });

    it('should return true for valid email', () => {
      expect(component.validateEmail('user@example.com')).toBeTrue();
      expect(component.validateEmail('user.name+tag@example.co.uk')).toBeTrue();
    });
  });

  describe('verifyEmail()', () => {
    it('should show error for invalid email', async () => {
      component.email = 'invalid-email';
      await component.verifyEmail();
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Invalid Email',
        icon: 'error',
        text: 'Please enter a valid email address.'
      }));
    });

    it('should show success and navigate for valid email', async () => {
      component.email = 'user@example.com';
      await component.verifyEmail();
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Verification Successful',
        icon: 'success',
        text: `The email \"${component.email}\" is valid and available.`,
        showCancelButton: true,
        confirmButtonText: 'Register',
        cancelButtonText: 'Close'
      }));
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/registration'], { state: { email: component.email.trim() } });
    });
  });
});