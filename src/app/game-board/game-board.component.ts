import { Component, OnInit, ViewChild } from '@angular/core';
import { JoinComponent } from '../join/join.component';
import { PlayerService } from '../player.service';
import { EventsService } from '../events.service';

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

  @ViewChild(JoinComponent) joinComponent;

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
            if (gameEvent.GameStarted) {
              this.loadGame()
            } 
          }
        }
      )
  }

  
}
