import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { ClientService } from '../../../core/services/client/client.service';

import { AuthService } from '../../../core/services/auth/auth.service';

import { Router, RouterModule } from '@angular/router';
 
@Component({

  selector: 'app-login',

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, RouterModule],

  templateUrl: './login.component.html',

  styleUrls: ['./login.component.css']

})

export class LoginPageComponent {

  // Removed local clientStore

  loginForm: FormGroup;

 
  constructor(

    private fb: FormBuilder,

    private clientService: ClientService,

    private authService: AuthService,

    private router: Router

  ) {

    this.loginForm = this.fb.group({

      email: ['', [Validators.required, Validators.email]],

      password: ['']

    });

  }

  validateEmail(email: string): boolean {

    if (!email) {

      return false;

    }
 
    const strongEmailRegex = /^[a-zA-Z0-9.\_%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 
    return strongEmailRegex.test(email.trim());

  }
 
  async onSubmit() {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }
 
    const emailInput = this.loginForm.value.email.trim().toLowerCase();

    const passwordInput = this.loginForm.value.password;
 
    

   this.clientService.loginAndVerify(emailInput, passwordInput).subscribe({

  next: (fmtsResponse: any) => {

    if (fmtsResponse && fmtsResponse.clientId) {

      // Store clientId

      sessionStorage.setItem('clientId', fmtsResponse.clientId);
 
      // If FMTS returns a token, store it

      if (fmtsResponse.token) {

        sessionStorage.setItem('token', fmtsResponse.token);

      }
 
      this.authService.login(emailInput);

      this.router.navigate(['/portfolio'], { state: { email: emailInput } });

    } else {

      Swal.fire({

        icon: 'error',

        title: 'Login Failed',

        text: 'Unexpected server response.'

      });

    }

  },

  error: (err) => {

    Swal.fire({

      icon: 'error',

      title: 'Login Failed',

      text: err.error?.message || 'Invalid credentials.'

    });

  }

});
 
  }

}

 