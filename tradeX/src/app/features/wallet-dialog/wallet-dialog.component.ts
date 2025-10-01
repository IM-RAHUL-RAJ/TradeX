import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WalletService } from '../../core/services/wallet/wallet.service';
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-wallet-dialog',
  templateUrl: './wallet-dialog.component.html',
  styleUrls: ['./wallet-dialog.component.css'],
  standalone: true,
  imports: [MatInputModule,ReactiveFormsModule, MatFormField, MatLabel, MatError,CommonModule,MatRadioModule]
})
export class WalletDialogComponent {
  walletForm: FormGroup;
  cashBalance: number;

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    public dialogRef: MatDialogRef<WalletDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { initialBalance: number }
  ) {
    this.cashBalance = data.initialBalance || 0;
    this.walletForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      action: ['deposit', Validators.required],
    });
  }

  onSubmit() {
    if (this.walletForm.invalid) return;

    const amount = this.walletForm.value.amount;
    const action = this.walletForm.value.action;

    const clientId = sessionStorage.getItem('clientId') || '';
    if (!clientId) {
      alert('User not logged in');
      return;
    }

    if (action === 'deposit') {
      this.walletService.deposit({ clientId, amount: Number(amount) }).subscribe({
        next: () => {
          // WalletService updates the shared balance, just close dialog
          this.dialogRef.close();
        },
        error: (err) => alert('Deposit failed: ' + err.message)
      });
    } else {
      this.walletService.withdraw({ clientId, amount: Number(amount) }).subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: (err) => alert('Withdrawal failed: ' + err.message)
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
 