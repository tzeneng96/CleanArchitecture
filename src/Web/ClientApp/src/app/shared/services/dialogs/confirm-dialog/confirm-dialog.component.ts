import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  title?: string;
  message?: string;
  cancelButton = "CANCEL";
  acceptButton = "ACCEPT";
  isDestructive = false;

  constructor(private _dialogRef: MatDialogRef<ConfirmDialogComponent>) { }

  cancel(): void {
    this._dialogRef.close(false);
  }

  accept(): void {
    this._dialogRef.close(true);
  }
}
