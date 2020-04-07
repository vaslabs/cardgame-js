import { Component } from '@angular/core';
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

   cards = [
     {id: "1", image: "assets/img/cattermelon.jpg"},
     {id: "2", image: "assets/img/curse_of_the_cat_butt.jpg"},
    ]
 
   // MatPaginator Output
   pageEvent: PageEvent;


}
