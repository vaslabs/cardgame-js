import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { JoinComponent } from '../join/join.component';
import { PlayerService } from '../player.service';
import { EventsService } from '../events.service';
import { DeckComponent } from '../deck/deck.component';

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
  server = ""

  @ViewChild(JoinComponent) joinComponent;
  @ViewChild(DeckComponent) deckComponent;

  ngAfterViewInit() {
    this.eventsService.currentMessage.subscribe(
      (msg: any) => {
        if (msg.GameConfiguration) {
          this.gameId = msg.GameConfiguration.id
          this.userId = msg.GameConfiguration.username
          this.server = msg.GameConfiguration.server
          this.streamEvents();
        }
      }
    )
  }

  showJoin(): boolean {
    return this.gameId == ""
  }


  loadGame() {
    this.playerService.recoverGame(this.server, this.gameId, this.userId)
      .subscribe(
        (data: any) => {
          this.deckComponent.setDeck(data.StartedGame.deck)
          this.deckComponent.localplayer = this.userId;
          this.deckComponent.gameId = this.gameId;
          this.gameConfiguration = {GameConfiguration: {id: this.gameId, username: this.userId, server: this.server}};
          this.eventsService.emitLocalEvent(this.gameConfiguration);
        }
      )
  }

  gameConfiguration = {}

  private removeTrailingSlash(server: string): string {
    const slash = server.lastIndexOf('/')
    if (slash  == server.length - 1) {
      return server.substring(0, slash)
    } else {
      return server
    }
  }

  streamEvents() {
    
    if (this.server != "") {
      this.eventsService.getGameEvent(this.removeTrailingSlash(this.server) + "/events/" + this.userId)
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

  
}
