import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { EmailVerificationComponent } from './features/email-verification/email-verification.component';
import { PreferencesComponent } from './features/preferences/preferences.component';
import { Component } from '@angular/core';


@Component({
  selector: 'app-preferences',
  standalone: true,
  template: ''
})
export class MockPreferencesComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, MockPreferencesComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // it(`should have the 'tradeX' title`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   expect(app.title).toEqual('tradeX');
  // });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('h1')?.textContent).toContain('tradeX');
  // });
});
