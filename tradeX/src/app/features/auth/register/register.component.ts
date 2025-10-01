import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import {

  FormBuilder,

  FormGroup,

  Validators,

  ReactiveFormsModule,

  AbstractControl,

  ValidationErrors

} from '@angular/forms';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { lastValueFrom } from 'rxjs';
 
import { ClientService, FMTSResponse } from '../../../core/services/client/client.service';

import { HeaderComponent } from '../../../shared/header/header.component';

import { FooterComponent } from '../../../shared/footer/footer.component';

import { AuthService } from '../../../core/services/auth/auth.service';
 
// Password match validator

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {

  const newPassword = control.get('newPassword');

  const confirmPassword = control.get('confirmPassword');

  return newPassword && confirmPassword && newPassword.value !== confirmPassword.value

    ? { passwordMismatch: true }

    : null;

}
 
// Age validator (user must be 18+)

function ageValidator(control: AbstractControl): ValidationErrors | null {

  const dob = control.value;

  if (!dob) return null;

  const birthDate = new Date(dob);

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

  return age >= 18 ? null : { underAge: true };

}
 
@Component({

  selector: 'app-register',

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],

  templateUrl: './register.component.html',

  styleUrls: ['./register.component.css']

})

export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  emailFromState: string = '';
 
  // Country-specific ID types

  allIdTypes: { [key: string]: string[] } = {

    IN: ['PAN', 'AADHAR'],

    US: ['SSN'],

    OTHER: ['Passport', 'Driver License']

  };

  idTypes: string[] = [];
 
  constructor(

    private fb: FormBuilder,

    private clientService: ClientService,

    private authService: AuthService,

    private router: Router

  ) {

    const nav = this.router.getCurrentNavigation();

    this.emailFromState = nav?.extras?.state?.['email'] ?? null;
 
    this.registerForm = this.fb.group(

      {

        email: ['', [Validators.required, Validators.email]],

        newPassword: [

          '',

          [

            Validators.required,

            Validators.minLength(8),

            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)

          ]

        ],

        confirmPassword: ['', [Validators.required]],

        dateOfBirth: ['', [Validators.required, ageValidator]],

        country: ['', Validators.required],

        postalCode: ['', Validators.required],

        idType: ['', Validators.required],

        idValue: ['', Validators.required]

      },

      { validators: passwordMatchValidator }

    );

  }
 
  ngOnInit() {

    // Prefill email if passed from previous step

    if (this.emailFromState) {

      this.registerForm.patchValue({ email: this.emailFromState });

    }
 
    // Update ID types dynamically when country changes

    this.registerForm.get('country')?.valueChanges.subscribe((country: string) => {

      const upperCountry = country?.toUpperCase() ?? '';

      this.idTypes = this.allIdTypes[upperCountry] ?? this.allIdTypes['OTHER'];

      // Reset selected ID type and value

      this.registerForm.patchValue({ idType: '', idValue: '' });

    });

  }
 
  get f() {

    return this.registerForm.controls;

  }
 
  async onRegister() {

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;

    }
 
    const formValue = this.registerForm.value;
 
    // Normalize postal code (all countries)

    const postalCodeNormalized = formValue.postalCode.replace(/[^a-zA-Z0-9]/g, '');
 
    // Normalize ID value based on country

    let idValueNormalized = formValue.idValue;

    const countryUpper = formValue.country.toUpperCase();

    if (countryUpper !== 'US') {

      idValueNormalized = idValueNormalized.replace(/[^a-zA-Z0-9]/g, '');

    }
 
    const newClient = {

      email: formValue.email.trim(),

      clientId: '', // Assigned by backend

      password: formValue.newPassword,

      dateOfBirth: formValue.dateOfBirth,

      country: formValue.country.trim(),

      postalCode: postalCodeNormalized,

      identifications: [{ type: formValue.idType, value: idValueNormalized }],

      cashBalance: 100000,

      portfolio: []

    };
 
    try {

      const result: FMTSResponse = await lastValueFrom(this.clientService.verifyClient(newClient));
 
      if (result?.clientId && result?.token) {

        await Swal.fire({

          icon: 'success',

          title: 'Registration Successful',

          text: `Your client ID is ${result.clientId}`

        });
 
        this.registerForm.reset();

        sessionStorage.setItem('clientId', result.clientId);

        sessionStorage.setItem('token', result.token);

        this.router.navigate(['/preferences'], { state: { clientId: result.clientId } });

      } else {

        await Swal.fire({

          icon: 'error',

          title: 'Registration Failed',

          text: 'Registration failed. Please try again.'

        });

      }

    } catch (error: any) {

      let errorMsg = 'Registration failed. Please try again.';

      if (error?.error) {

        errorMsg = typeof error.error === 'string' ? error.error : error.error.message ?? errorMsg;

      }

      await Swal.fire({

        icon: 'error',

        title: 'Registration Failed',

        text: errorMsg

      });

    }

  }

}

 