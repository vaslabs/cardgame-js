import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { JoinComponent } from '../join/join.component';
import { PlayerService } from '../player.service';
import { EventsService } from '../events.service';
import { DeckComponent } from '../deck/deck.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventShowerComponent } from './event-shower/event-shower.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  constructor(private playerService: PlayerService, private eventsService: EventsService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.eventsService.streamLocalEvents().subscribe(
      (msg: any) => {
        console.log(JSON.stringify(msg))
        if (msg.GameConfiguration) {
          this.gameId = msg.GameConfiguration.id
          this.userId = msg.GameConfiguration.username
          this.server = msg.GameConfiguration.server
          this.loadGame()
        }
      }
    )
    if (this.gameId == "" || this.userId == "" || this.server == "") {
      this.router.navigateByUrl("/")
    }
  }

  gameId = ""
  userId = ""
  server = ""

  @ViewChild(JoinComponent) joinComponent;
  @ViewChild(DeckComponent) deckComponent;

  showJoin(): boolean {
    return this.gameId == ""
  }


  loadGame() {
    this.playerService.recoverGame(this.server, this.gameId, this.userId)
      .subscribe(
        (data: any) => {
          this.eventsService.emitLocalEvent(data);
          if (data.StartedGame) {
            this.startedGame(data.StartedGame)
          } else if (data.GameRestarted) {
            this.startedGame(data.GameRestarted.StartedGame)
          }
        }
        
      )
  }

  startedGame(startedGame: any) {
    this.deckComponent.setDeck(startedGame.deck)
    this.deckComponent.localplayer = this.userId;
    this.deckComponent.gameId = this.gameId;
    this.gameConfiguration = {GameConfiguration: {id: this.gameId, username: this.userId, server: this.server}};
  }

  gameConfiguration = {}

  private durationInSeconds = 5

  openSnackBar(event) {
    const message = this.eventMessage(event)
    if (message) {
      this._snackBar.openFromComponent(EventShowerComponent, {
        duration: this.durationInSeconds * 1000,
        data: {message: message}
      });
    }
  }

  private eventMessage(event: any): string {
    if (event.DeckShuffled) {
      return "Deck shuffled"
    } else if (event.BorrowedCard) {
      return event.BorrowedCard.playerId + " borrowed a card from deck"
    } else if (event.OutOfSync) {
      if (event.OutOfSync.playerId == this.userId) {
        return "Your game is out of sync, close other game tabs and try to refresh"
      } else 
        return event.OutOfSync.playerId + " is out of sync"
    }
    else 
      return undefined
  }

  
}
