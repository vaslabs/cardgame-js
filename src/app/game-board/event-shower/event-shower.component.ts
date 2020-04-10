import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-event-shower',
  templateUrl: './event-shower.component.html',
  styleUrls: ['./event-shower.component.css']
})
export class EventShowerComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  ngOnInit(): void {
  }

}
