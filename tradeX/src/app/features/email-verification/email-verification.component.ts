import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { Router } from '@angular/router';
import { ClientService } from '../../core/services/client/client.service';
import { lastValueFrom } from 'rxjs';
 
@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent {
  email: string = '';
  emailValid: boolean = true;
 
  constructor(
    private router: Router,
    private clientService: ClientService // <-- Add this line
  ) {}
 
  /**
   * Strong email validation:
   * - Validates email format using regex
   * - Checks for no consecutive dots
   * - Limits local part length to 64
   * - Domain parts cannot start or end with hyphens
   */
  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) return false;
    if (email.includes('..')) return false; // no consecutive dots
 
    const [localPart, domain] = email.split('@');
    if (localPart.length > 64) return false;
 
    const domainParts = domain.split('.');
    for (const part of domainParts) {
      if (part.startsWith('-') || part.endsWith('-')) return false;
      if (part.length === 0) return false;
    }
 
    return true;
  }
 
  async verifyEmail() {
    const emailTrimmed = this.email.trim().toLowerCase();
    this.emailValid = this.validateEmail(emailTrimmed);
 
    if (!this.emailValid) {
      await Swal.fire({
        title: 'Invalid Email',
        icon: 'error',
        text: 'Please enter a valid email address.',
        confirmButtonText: 'OK'
      });
      return;
    }
 
    try {
      // Await backend response
      const exists = await lastValueFrom(
        this.clientService.verifyEmailExists(emailTrimmed)
      );
 
      if (exists) {
        await Swal.fire({
          title: 'Account Exists',
          icon: 'info',
          text: `The email "${emailTrimmed}" is already registered.`,
          confirmButtonText: 'OK'
        });
        return;
      }
 
      // Email is valid and available
      const result = await Swal.fire({
        title: 'Verification Successful',
        icon: 'success',
        text: `The email "${emailTrimmed}" is valid and available.`,
        showCancelButton: true,
        confirmButtonText: 'Register',
        cancelButtonText: 'Close'
      });
 
      if (result.isConfirmed) {
        this.router.navigate(['/registration'], { state: { email: emailTrimmed } });
      }
 
    } catch (error) {
      console.error(error);
      await Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Could not verify email. Please try again later.',
        confirmButtonText: 'OK'
      });
    }
  }
}