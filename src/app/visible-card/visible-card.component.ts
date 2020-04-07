import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-visible-card',
  templateUrl: './visible-card.component.html',
  styleUrls: ['./visible-card.component.css']
})
export class VisibleCardComponent implements OnInit {

  @Input() cardId = ""
  @Input() cardImage = ""
  constructor() { }

  ngOnInit(): void {
  }

}
