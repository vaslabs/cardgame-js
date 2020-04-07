import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-discard-pile',
  templateUrl: './discard-pile.component.html',
  styleUrls: ['./discard-pile.component.css']
})
export class DiscardPileComponent implements OnInit {

  cards = []

  lastPlayed = { id: "0", image: "assets/img/hidden_card.jpg"}

  constructor() { }

  ngOnInit(): void {
  }

  updateCard(card: any) {
    this.cards.push(card)
    this.lastPlayed = card;
  }

}
