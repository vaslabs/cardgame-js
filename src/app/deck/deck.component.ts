import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../player.service';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent implements OnInit {

  deck = {cards: []}

  localplayer: string = null

  gameId: string = null

  nextCard = 'assets/img/hidden_card.jpg'
  private defaultCard = 'assets/img/hidden_card.jpg'

  constructor(private playerService: PlayerService, private eventService: EventsService) { }

  ngOnInit(): void {
    this.eventService.currentMessage.subscribe(
      (msg: any) => {
        if (msg.GotCard) {
          let card = msg.GotCard.card
          if (card.HiddenCard) {
            this.deleteCard(card.HiddenCard.id)
          } else if (card.VisibleCard) {
            this.deleteCard(card.VisibleCard.id)
          }
        } else if (msg.DeckShuffled) {
            this.deck = msg.DeckShuffled.deck
        } else if (msg.RecoverDeck) {
          this.setDeck(msg.RecoverDeck.deck)
        } else if (msg.GameConfiguration) {
          this.gameId = msg.GameConfiguration.id
          this.localplayer = msg.GameConfiguration.username
        } else if (msg.BackToDeck) {
          const position = msg.BackToDeck.index
          if (position >= this.deck.cards.length) {
            this.deck.cards.push(msg.BackToDeck.card)
            this.updateCard()
          } else {
            this.deck.cards.splice(position, 0, msg.BackToDeck.card)
            this.updateCard()
          }
        }
      }
    );
  }

  setDeck(deck) {
    this.deck = deck
    this.updateCard()
    this.eventService.emitLocalEvent({DeckSize: {value: this.deck.cards.length}})
  }

  drawCard() {
    const action = { DrawCard: {player: this.localplayer}};
    this.updateCard()
    this.drawCardAction(action);
  }

  private drawCardAction(action: any) {
    if (this.localplayer && this.gameId) {
      this.playerService.action(action)
    }
  }

  deleteCard(id: string) {
      this.deck.cards = this.deck.cards.filter(card => 
        !(card.HiddenCard && card.HiddenCard.id == id || card.VisibleCard && card.VisibleCard.id == id)
      )
      this.updateCard()

      this.eventService.emitLocalEvent({DeckSize: {value: this.deck.cards.length}})
  }

  shuffle() {
    if (this.localplayer && this.gameId) {
      const action = { Shuffle: {player: this.localplayer}}
      this.playerService.action(action)
    }
  }

  drawFromTheBottom() {
    if (this.localplayer && this.gameId) {
      const action = { BottomDraw: {player: this.localplayer}};
      this.drawCardAction(action);
    }
    this.eventService.emitLocalEvent({DeckSize: {value: this.deck.cards.length}})
    this.updateCard()

  }

  borrow(index: number) {
    const action = {BorrowCard: {player: this.localplayer, index: index}}
    this.playerService.action(action)
    this.updateCard()

  }

  private updateCard() {
    if (this.deck.cards[0]) {
      const card = this.deck.cards[0]
      if (card.VisibleCard) {
        this.nextCard = card.VisibleCard.image
      } else {
        this.nextCard = this.defaultCard
      }
    }
    this.eventService.emitLocalEvent({DeckSize: {value: this.deck.cards.length}})
  }


}
