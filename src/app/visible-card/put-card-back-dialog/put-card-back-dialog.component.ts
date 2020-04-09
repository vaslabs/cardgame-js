import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-put-card-back-dialog',
  templateUrl: './put-card-back-dialog.component.html',
  styleUrls: ['./put-card-back-dialog.component.css']
})
export class PutCardBackDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PutCardBackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface DialogData {
  index: number
  visible: boolean
  maxIndex: number
}