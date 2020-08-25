import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AllCardsViewComponent, DiscardPileData } from './all-cards-view/all-cards-view.component';
import { PlayerService } from '../player.service';
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

  layout = {
    grid: false
  }

  grabbingCards = []

  constructor(private eventService: EventsService, private _bottomSheet: MatBottomSheet, private playerService: PlayerService) { }

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
        } else if (msg.Layout) {
            this.layout.grid = msg.Layout.gatheringPile
        } else if (msg.AddedToPile) {
            const takenCardIds = msg.AddedToPile.cards.map(c => c.id)
            this.cards = this.cards.filter(c => !takenCardIds.includes(c.id))
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
      if (this.cards.length > 0)
        this.lastPlayed = this.cards[this.cards.length - 1]
    }
  }

  grab(card) {
    this.grabbingCards.push(card)
    this.cards = this.cards.filter(c => c.id != card.id)
  }

  cancelGrab() {
    this.cards = this.cards.concat(this.grabbingCards)
    this.grabbingCards = [];
  }

  grabAll() {
    const grab = this.grabbingCards.map(c => c.id);
    this.cards = this.cards.concat(this.grabbingCards)
    this.grabbingCards = [];
    this.playerService.action({GrabCards:{player: this.playerId, cards: grab}})
  }

}
