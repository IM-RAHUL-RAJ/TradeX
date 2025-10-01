import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WalletDialogComponent } from './wallet-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { WalletService } from '../../core/services/wallet/wallet.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('WalletDialogComponent', () => {
  let component: WalletDialogComponent;
  let fixture: ComponentFixture<WalletDialogComponent>;
  let mockWalletService: any;
  let mockDialogRef: any;

  beforeEach(async () => {
    mockWalletService = {
      deposit: jasmine.createSpy().and.returnValue(of({ clientId: '123', cashBalance: 6000 })),
      withdraw: jasmine.createSpy().and.returnValue(of({ clientId: '123', cashBalance: 5000 }))
    };
    mockDialogRef = { close: jasmine.createSpy() };

    await TestBed.configureTestingModule({
      imports: [
        WalletDialogComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        NoopAnimationsModule  // animations fix
      ],
      providers: [
        { provide: WalletService, useValue: mockWalletService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { initialBalance: 16000 } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WalletDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and display initial balance (positive)', () => {
    expect(component).toBeTruthy();
    expect(component.cashBalance).toBe(16000);
  });

  it('should allow deposit and close dialog (positive)', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('fakeClientId');
    component.walletForm.setValue({ amount: 800, action: 'deposit' });
    component.onSubmit();
    expect(mockWalletService.deposit).toHaveBeenCalled();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should allow withdraw and close dialog (positive)', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('fakeClientId');
    component.walletForm.setValue({ amount: 400, action: 'withdraw' });
    component.onSubmit();
    expect(mockWalletService.withdraw).toHaveBeenCalled();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should not submit with invalid form (negative)', () => {
    component.walletForm.setValue({ amount: '', action: 'deposit' });
    component.onSubmit();
    expect(mockWalletService.deposit).not.toHaveBeenCalled();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should close dialog on onClose (positive)', () => {
    component.onClose();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should alert if not logged in (edge)', () => {
    spyOn(window, 'alert');
    spyOn(sessionStorage, 'getItem').and.returnValue('');
    component.walletForm.setValue({ amount: 500, action: 'deposit' });
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('User not logged in');
  });

  it('should show alert for backend deposit error (negative)', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('fakeClientId');
    mockWalletService.deposit.and.returnValue(throwError(() => new Error('Deposit failed!')));
    spyOn(window, 'alert');
    component.walletForm.setValue({ amount: 300, action: 'deposit' });
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Deposit failed: Deposit failed!');
  });

  it('should show alert for backend withdraw error (negative)', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('fakeClientId');
    mockWalletService.withdraw.and.returnValue(throwError(() => new Error('Withdrawal failed!')));
    spyOn(window, 'alert');
    component.walletForm.setValue({ amount: 90000, action: 'withdraw' });
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Withdrawal failed: Withdrawal failed!');
  });

  it('should not accept zero or negative input (edge)', () => {
    component.walletForm.setValue({ amount: 0, action: 'deposit' });
    component.onSubmit();
    expect(mockWalletService.deposit).not.toHaveBeenCalled();

    component.walletForm.setValue({ amount: -50, action: 'withdraw' });
    component.onSubmit();
    expect(mockWalletService.withdraw).not.toHaveBeenCalled();
  });
});
 