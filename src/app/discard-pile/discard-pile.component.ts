import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-discard-pile',
  templateUrl: './discard-pile.component.html',
  styleUrls: ['./discard-pile.component.css']
})
export class DiscardPileComponent implements OnInit {

  cards = []
  private cardById = {}

  private hiddenCard = { id: "0", image: "assets/img/hidden_card.jpg"}
  lastPlayed = this.hiddenCard

  constructor(private eventService: EventsService) { }

  ngOnInit(): void {
    this.eventService.currentMessage.subscribe(
      msg => {
        if (msg.PlayedCard) {
          this.updateCard(msg.PlayedCard.card)
        } else if (msg.RecoverDiscardPile) {
          this.cards = [];
          msg.RecoverDiscardPile.cards.forEach(c => this.updateCard(c.VisibleCard))
          
        }
      }
    )
  }

  updateCard(card: any) {
    if (!this.cardById[card.id]) {
      this.cards.push(card)
      this.lastPlayed = card;
    }
  }

}
