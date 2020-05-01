import { Component, OnInit, Inject } from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-view-card',
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.css']
})
export class ViewCardComponent implements OnInit {

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ViewCardComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public card: ViewCardData
  ) { }

  ngOnInit(): void {
  }

  zoomOut() {
    this._bottomSheetRef.dismiss();
  }

}


interface ViewCardData {
  uri: string
}