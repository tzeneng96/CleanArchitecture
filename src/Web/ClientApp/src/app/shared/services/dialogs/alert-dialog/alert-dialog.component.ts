import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.css'
})
export class AlertDialogComponent {
  title?: string;
  message?: string;
  closeButton?: string = "CLOSE";

  constructor(private _dialogRef: MatDialogRef<AlertDialogComponent>) { }

  close(): void {
    this._dialogRef.close();
  }
}
