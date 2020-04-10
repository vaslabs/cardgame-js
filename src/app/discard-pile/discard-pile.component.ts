import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AllCardsViewComponent, DiscardPileData } from './all-cards-view/all-cards-view.component';
@Component({
  selector: 'app-discard-pile',
  templateUrl: './discard-pile.component.html',
  styleUrls: ['./discard-pile.component.css']
})
export class DiscardPileComponent implements OnInit {

  cards = []
  private cardById = {}
  private playerId = ""
  private gameId = ""

  private hiddenCard = { id: "0", image: "assets/img/hidden_card.jpg"}
  lastPlayed = this.hiddenCard

  constructor(private eventService: EventsService, private _bottomSheet: MatBottomSheet) { }

  ngOnInit(): void {
    this.eventService.currentMessage.subscribe(
      msg => {
        if (msg.PlayedCard) {
          this.updateCard(msg.PlayedCard.card)
        } else if (msg.RecoverDiscardPile) {
          this.cards = [];
          msg.RecoverDiscardPile.cards.forEach(c => this.updateCard(c.VisibleCard))
        } else if (msg.GameConfiguration) {
          this.playerId = msg.GameConfiguration.username
          this.gameId = msg.GameConfiguration.id
        } else if (msg.CardRecovered) {
          const card = msg.CardRecovered.card
          if (card.VisibleCard)
            this.removeCard(card.VisibleCard.id)
          else if (card.HiddenCard) 
            this.removeCard(card.HiddenCard.id)
        }
      }
    )
  }

  openBottomSheet(): void {
    this._bottomSheet.open(AllCardsViewComponent, {data: {cards: this.cards, playerId: this.playerId, gameId: this.gameId}});
  }

  updateCard(card: any) {
    if (!this.cardById[card.id]) {
      this.cards.push(card)
      this.cardById[card.id] = true
      this.lastPlayed = card
    }
  }

  removeCard(cardId: string) {
    if (this.cardById[cardId]) {
      this.cards = this.cards.filter(c => c.id != cardId)
      this.cardById[cardId] = false
    }
  }

}
