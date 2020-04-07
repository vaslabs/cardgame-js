import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { JoinComponent } from '../join/join.component';
import { PlayerService } from '../player.service';
import { EventsService } from '../events.service';
import { HandComponent } from '../hand/hand.component';

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

  deck = {cards: []}


  hand = []

  @ViewChild(JoinComponent) joinComponent;
  @ViewChild(HandComponent) handComponent;

  ngAfterViewInit() {
    this.userId = this.joinComponent.userId
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
        (data: any) =>
          this.deck = data.StartedGame.deck
      )
  }

  streamEvents() {
    this.eventsService.getGameEvent("http://localhost:8080/events/" + this.userId)
      .subscribe(
        (data: MessageEvent) => {
          if (data.data != "") {
            const gameEvent = JSON.parse(data.data)
            console.log(gameEvent)
            if (gameEvent.GameStarted) {
              this.loadGame()
            }
            if (gameEvent.GotCard) {
              console.log(gameEvent.GotCard.card.VisibleCard)
              this.handComponent.cards.push(gameEvent.GotCard.card.VisibleCard)
            }
          }
        }
      )
  }

  
}
