import { Component, Input } from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.css']
})
export class HandComponent {

  constructor() { }


   // MatPaginator Inputs
   length = 10;
   pageSize = 5;

   @Input()
   cards = []
 
   // MatPaginator Output
   pageEvent: PageEvent;


}
