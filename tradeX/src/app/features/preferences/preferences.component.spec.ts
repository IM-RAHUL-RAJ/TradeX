import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PreferencesComponent } from './preferences.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UrlTree } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { ClientDataService } from '../../ClientDataService';
import { of, throwError } from 'rxjs';
import {
  InvestmentPreferences,
  INVESTMENT_PURPOSE_OPTIONS,
  RISK_TOLERANCE_OPTIONS,
  INCOME_CATEGORY_OPTIONS,
  INVESTMENT_LENGTH_OPTIONS
} from '../../core/models/preferences.model';

describe('PreferencesComponent', () => {
  let component: PreferencesComponent;
  let fixture: ComponentFixture<PreferencesComponent>;
  let clientStoreSpy: jasmine.SpyObj<ClientDataService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
  clientStoreSpy = jasmine.createSpyObj('ClientDataService', ['getPreferences', 'setPreferences', 'updatePreferences']);
    clientStoreSpy.getPreferences.and.returnValue(of({
      purpose: INVESTMENT_PURPOSE_OPTIONS[0],
      risk: RISK_TOLERANCE_OPTIONS[0],
      income: INCOME_CATEGORY_OPTIONS[0],
      length: INVESTMENT_LENGTH_OPTIONS[0],
      roboAdvisor: false
    }));
  clientStoreSpy.setPreferences.and.returnValue(of({}));
  clientStoreSpy.updatePreferences.and.returnValue(of({}));
    routerSpy = jasmine.createSpyObj('Router', ['getCurrentNavigation', 'navigate']);
    routerSpy.getCurrentNavigation.and.returnValue({
      id: 1,
      initialUrl: {} as UrlTree,
      extractedUrl: {} as UrlTree,
      trigger: 'imperative',
      extras: { state: { email: 'test@example.com' } },
      previousNavigation: null
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PreferencesComponent],
      providers: [
        { provide: ClientDataService, useValue: clientStoreSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: {} }
      ]
    }).compileComponents();

    sessionStorage.setItem('clientId', 'C001');
    fixture = TestBed.createComponent(PreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required controls', () => {
    const form = component.preferencesForm;
    expect(form.contains('purpose')).toBeTrue();
    expect(form.contains('risk')).toBeTrue();
    expect(form.contains('income')).toBeTrue();
    expect(form.contains('length')).toBeTrue();
    expect(form.contains('roboAdvisor')).toBeTrue();
  });

  it('should not submit if form is invalid or clientId missing', () => {
    sessionStorage.removeItem('clientId');
    component.preferencesForm.setValue({
      purpose: '',
      risk: '',
      income: '',
      length: '',
      roboAdvisor: false
    });
    component.onSubmit();
    expect(clientStoreSpy.setPreferences).not.toHaveBeenCalled();
    expect(clientStoreSpy.updatePreferences).not.toHaveBeenCalled();
  });

  it('should populate form with existing preferences on init', fakeAsync(() => {
    const mockPrefs: InvestmentPreferences = {
      purpose: INVESTMENT_PURPOSE_OPTIONS[0],
      risk: RISK_TOLERANCE_OPTIONS[2],
      income: INCOME_CATEGORY_OPTIONS[4],
      length: INVESTMENT_LENGTH_OPTIONS[1],
      roboAdvisor: true
    };
    clientStoreSpy.getPreferences.and.returnValue(of(mockPrefs));
    component.ngOnInit();
    tick();
    expect(component.preferencesForm.value).toEqual(mockPrefs);
    expect(component.isUpdate).toBeTrue();
  }));

  it('should save preferences and navigate to portfolio if updating', fakeAsync(() => {
    component.preferencesForm.setValue({
      purpose: INVESTMENT_PURPOSE_OPTIONS[1],
      risk: RISK_TOLERANCE_OPTIONS[3],
      income: INCOME_CATEGORY_OPTIONS[5],
      length: INVESTMENT_LENGTH_OPTIONS[2],
      roboAdvisor: true
    });
    component.isUpdate = true;
    clientStoreSpy.updatePreferences.and.returnValue(of({}));

    component.onSubmit();
    tick(500);
    expect(clientStoreSpy.updatePreferences).toHaveBeenCalledWith('C001', jasmine.any(Object));
    expect(component.message).toBe('Preferences updated successfully!');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/portfolio']);
  }));

  it('should save preferences and navigate to login if new', fakeAsync(() => {
    component.preferencesForm.setValue({
      purpose: INVESTMENT_PURPOSE_OPTIONS[2],
      risk: RISK_TOLERANCE_OPTIONS[0],
      income: INCOME_CATEGORY_OPTIONS[0],
      length: INVESTMENT_LENGTH_OPTIONS[0],
      roboAdvisor: true
    });
    component.isUpdate = false;
    clientStoreSpy.setPreferences.and.returnValue(of({}));

    component.onSubmit();
    tick(500);
    expect(clientStoreSpy.setPreferences).toHaveBeenCalledWith('C001', jasmine.any(Object));
    expect(component.message).toBe('Preferences saved successfully!');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should show error message if save fails', fakeAsync(() => {
    component.preferencesForm.setValue({
      purpose: INVESTMENT_PURPOSE_OPTIONS[2],
      risk: RISK_TOLERANCE_OPTIONS[0],
      income: INCOME_CATEGORY_OPTIONS[0],
      length: INVESTMENT_LENGTH_OPTIONS[0],
      roboAdvisor: true
    });
    component.isUpdate = false;
    clientStoreSpy.setPreferences.and.returnValue(throwError(() => new Error('Save error')));

    component.onSubmit();
    tick();
    expect(component.message).toBe('Failed to save preferences. Please try again.');
  }));
});