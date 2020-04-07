import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { JoinComponent } from '../join/join.component';
import { PlayerService } from '../player.service';
import { EventsService } from '../events.service';
import { HandComponent } from '../hand/hand.component';
import { DeckComponent } from '../deck/deck.component';
import { DiscardPileComponent } from '../discard-pile/discard-pile.component';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  constructor(private playerService: PlayerService, private eventsService: EventsService) { }

  ngOnInit(): void {
  }

  gameId = ""
  userId = ""

  @ViewChild(JoinComponent) joinComponent;
  @ViewChild(DeckComponent) deckComponent;
  @ViewChild(DiscardPileComponent) discardPileComponent;

  ngAfterViewInit() {
    this.userId = this.joinComponent.userId;
    this.gameId = this.joinComponent.gameId;
  }

  showJoin(): boolean {
    return this.gameId == ""
  }

  receiveMessage($event) {
    this.gameId = $event.gameId
    this.userId = $event.userId
    this.streamEvents()
  }

  loadGame() {
    this.playerService.recoverGame(this.gameId, this.userId)
      .subscribe(
        (data: any) => {
          this.deckComponent.deck = data.StartedGame.deck
          this.deckComponent.localplayer = this.userId;
          this.deckComponent.gameId = this.gameId;
          this.gameConfiguration = {GameConfiguration: {id: this.gameId, username: this.userId}};
          this.eventsService.emitLocalEvent(this.gameConfiguration);
        }
      )
  }

  gameConfiguration = {}

  streamEvents() {
    this.eventsService.getGameEvent("http://localhost:8080/events/" + this.userId)
      .subscribe(
        (data: MessageEvent) => {
          if (data.data != "") {
            const gameEvent = JSON.parse(data.data)
            console.log(gameEvent)
            if (gameEvent.GameStarted) {
              this.loadGame()
            } else if (gameEvent.DeckShuffled) {
              this.deckComponent.deck = gameEvent.DeckShuffled.deck
            } else if (gameEvent.PlayedCard) {
              this.discardPileComponent.updateCard(gameEvent.PlayedCard.card)
            }
          }
        }
      )
  }

  
}
