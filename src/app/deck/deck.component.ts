import { Component, OnInit, Input } from '@angular/core';
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

  constructor(private playerService: PlayerService, private eventService: EventsService) { }

  ngOnInit(): void {
    this.eventService.currentMessage.subscribe(
      msg => {
        if (msg.GotCard) {
          if (msg.GotCard.card.HiddenCard) {
            console.log("must delete card")
            this.deleteCard(msg.GotCard.card.HiddenCard.id)
          } else if (msg.DeckShuffled) {
            this.deck = msg.DeckShuffled.deck
          }
        }
      }
    );
  }

  setDeck(deck) {
    this.deck = deck
  }

  drawCard() {
    if (this.localplayer && this.gameId) {
      const action = { DrawCard: {player: this.localplayer}}
      this.playerService.action(action, this.gameId).subscribe(
        (event: any) => {
          if (event.GotCard) {
            if (event.GotCard.card.VisibleCard) {
              this.deleteCard(event.GotCard.card.VisibleCard.id)
            } else if (event.GotCard.card.HiddenCard) {
              this.deleteCard(event.GotCard.card.HiddenCard.id)
            }
          }
        }
      )
    }
  }

  deleteCard(id: string) {
      this.deck.cards = this.deck.cards.filter(card => 
        !(card.HiddenCard && card.HiddenCard.id == id || card.VisibleCard && card.VisibleCard.id == id)
      )
  }

  shuffle() {
    if (this.localplayer && this.gameId) {
      const action = { Shuffle: {player: this.localplayer}}
      this.playerService.action(action, this.gameId).subscribe(
        (event: any) => {
          if (event.GotCard) {
            this.deck.cards.pop()
          }
        }
      )
    }
  }


}
