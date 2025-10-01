import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import {
  InvestmentPreferences,
  RISK_TOLERANCE_OPTIONS,
  INCOME_CATEGORY_OPTIONS,
  INVESTMENT_LENGTH_OPTIONS,
  INVESTMENT_PURPOSE_OPTIONS
} from '../../core/models/preferences.model';
import { CommonModule } from '@angular/common';
import { ClientDataService } from '../../ClientDataService';


@Component({
  selector: 'app-preferences',
  standalone: true,
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class PreferencesComponent implements OnInit {
  preferencesForm: FormGroup;

  purposeOptions = INVESTMENT_PURPOSE_OPTIONS;
  riskOptions = RISK_TOLERANCE_OPTIONS;
  incomeOptions = INCOME_CATEGORY_OPTIONS;
  lengthOptions = INVESTMENT_LENGTH_OPTIONS;

  message = '';
  isUpdate = false;
  clientId: string | null = null;
  email: string | null = null;

  constructor(
    private fb: FormBuilder,
    private clientStore: ClientDataService,
    private router: Router,
    private authService: AuthService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.clientId = sessionStorage.getItem('clientId');
    this.email = nav?.extras?.state?.['email'] ?? null;

    this.preferencesForm = this.fb.group({
      purpose: ['', Validators.required],
      risk: ['', Validators.required],
      income: ['', Validators.required],
      length: ['', Validators.required],
      roboAdvisor: [false]
    });
  }

  ngOnInit(): void {
    if (!this.clientId) return;

    this.clientStore.getPreferences(this.clientId).subscribe({
      next: (prefs) => {
        if (prefs && prefs.purpose) {
          this.preferencesForm.patchValue(prefs);
          this.isUpdate = true; // Only update if there’s existing prefs
        } else {
          this.isUpdate = false;
        }
      },
      error: () => {
        this.isUpdate = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.preferencesForm.valid || !this.clientId) return;

    const payload: InvestmentPreferences = { ...this.preferencesForm.value };

    const request$ = this.isUpdate
      ? this.clientStore.updatePreferences(this.clientId, payload) // PUT
      : this.clientStore.setPreferences(this.clientId, payload);   // POST

    request$.subscribe({
      next: () => {
        this.message = this.isUpdate
          ? 'Preferences updated successfully!'
          : 'Preferences saved successfully!';
        setTimeout(() => this.router.navigate([this.isUpdate ? '/portfolio' : '/login']), 500);
      },
      error: () => {
        this.message = 'Failed to save preferences. Please try again.';
      }
    });
  }
}
