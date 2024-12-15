import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-transaction-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-transaction-dialog.component.html',
  styleUrl: './confirm-transaction-dialog.component.scss'
})
export class ConfirmTransactionDialogComponent {

  action: any;
  
  constructor(
    public dialogRef: MatDialogRef<ConfirmTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('data', data);
    this.action = data;
  }

  onConfirm(): void {
    this.dialogRef.close(this.action);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
