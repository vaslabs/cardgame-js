import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-discard-pile',
  templateUrl: './discard-pile.component.html',
  styleUrls: ['./discard-pile.component.css']
})
export class DiscardPileComponent implements OnInit {

  cards = []

  lastPlayed = { id: "0", image: "assets/img/hidden_card.jpg"}

  constructor(private eventService: EventsService) { }

  ngOnInit(): void {
    this.eventService.currentMessage.subscribe(
      msg => {
        if (msg.PlayedCard) {
          this.updateCard(msg.PlayedCard.card)
        }
      }
    )
  }

  updateCard(card: any) {
    this.cards.push(card)
    this.lastPlayed = card;
  }

}
