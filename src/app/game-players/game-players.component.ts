import { Component, OnInit, Inject } from '@angular/core';
import { EventsService } from '../events.service';
import { PlayerService } from '../player.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';
export interface DialogData {
  from: string;
  index: number;
}


@Component({
  selector: 'app-game-players',
  templateUrl: './game-players.component.html',
  styleUrls: ['./game-players.component.css']
})
export class GamePlayersComponent implements OnInit {

  constructor(
    private eventService: EventsService, 
    private playerService: PlayerService, 
    public dialog: MatDialog, 
    private localStorage: LocalStorageService, 
    private router: Router
  ) { }

  players = []
  private playerById = {}
  gameId = ""
  localplayer = ""
  gameStarted = false
  server = ""
  gameLayout = {
    canSteal: true,
    showPoints: false
  }

  ngOnInit(): void {
    this.eventService.currentMessage.subscribe(
      event => {
        if (event.NextPlayer) {
          this.setHasTurn(event.NextPlayer.player)
        } if (event.PlayerJoined) {
          this.storePlayer(event.PlayerJoined.id, 0)
        } else if (event.GameConfiguration) {
          this.gameId = event.GameConfiguration.id
          this.localplayer = event.GameConfiguration.username
          this.server = event.GameConfiguration.server
          this.playerService.recoverGame(this.server, this.gameId, this.localplayer)
            .subscribe(
              (res: any) => {
                this.playerService.action({Authorise: {playerId: this.localplayer}})
                if (res.StartingGame) {
                  this.players = []
                  this.playerById = {}
                  res.StartingGame.playersJoined.forEach(p => this.storePlayer(p.id, 0))
                  this.gameStarted = false
                } else if (res.StartedGame) {
                  this.startedGame(res.StartedGame)
                }
              }
            )
        } else if (event.GameStarted) {
          this.gameStarted = true
          this.setHasTurn(event.GameStarted.startingPlayer)
        } else if (event.PlayerLeft) {
          this.removePlayer(event.PlayerLeft.player, event.PlayerLeft.nextCurrentPlayer)
        } else if (event.MoveCard && event.MoveCard.card.VisibleCard) {
          this.eventService.emitLocalEvent({GotCard: {playerId: this.localplayer, card: event.MoveCard.card}})
        } else if (event.GameRestarted) {
          this.startedGame(event.GameRestarted.startedGame)
        }
      }

    )
  }

  private setHasTurn(id) {
    this.players.forEach(player => player.hasTurn = false);
    const player = this.players.find(player => player.id == id)
    if (player) {
      player.hasTurn = true
    }
  }

  private storePlayer(playerId: string, points: number) {
    if (!this.playerById[playerId]) {
      const player = {id: playerId, hasTurn: false, points: points}
      this.players.push(player)
      this.playerById[playerId] = player;
    }
  }

  private startedGame(startedGame: any) {
    this.players = []
    this.playerById = {}
    this.gameStarted = true
    const currentPlayer = startedGame.nextPlayer
    startedGame.players.forEach((p, index) => {
        this.storePlayer(p.id, p.points)
        if (index == currentPlayer) {
          this.setHasTurn(p.id)
        }
        if (p.id == this.localplayer) {
          this.configureGame(p)
          this.eventService.emitLocalEvent({RecoverHand: p.hand})
        }
      }
    );
    this.eventService.emitLocalEvent(
      {RecoverDiscardPile:{cards: startedGame.discardPile.cards}}
    );

    this.eventService.emitLocalEvent(
      {RecoverDeck: {deck: startedGame.deck}}
    );

    const borrowed = startedGame.deck.borrowed
    if (borrowed && borrowed.playerId == this.localplayer) {
      this.eventService.emitLocalEvent({RecoverBorrow: borrowed.cards})
    }
  }

  private configureGame(p: any) {
    const gameLayoutConfiguration = {Layout:{gatheringPile: false, showPoints: false}}
    const gatheringPile = p.gatheringPile
    if (gatheringPile.HiddenPile) {
      gameLayoutConfiguration.Layout.gatheringPile = true
      gameLayoutConfiguration.Layout.showPoints = true
      this.gameLayout.canSteal = false
      this.gameLayout.showPoints = true
    }
    this.eventService.emitLocalEvent(gameLayoutConfiguration)
  }
 
  chooseNext(next: string) {
    this.playerService.action({ChooseNextPlayer: {player: this.localplayer, next: next}})
  }

  steal(from: string, index: number) {
    this.playerService.action({StealCard: {player: this.localplayer, from: from, cardIndex: index}})
  }

  openDialog(from: string): void {
    const dialogRef = this.dialog.open(StealDialog, {
      width: '250px',
      data: {from: from, index: 0}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.steal(from, result)
    });
  }

  kill(player: string): void {
    this.playerService.action({Leave: {player: player}})
  }

  restartGame() {
    console.log("Restarting game")
    this.playerService.action({RestartGame:{player: this.localplayer}})
  }

  quitGame() {
    this.localStorage.remove("game-id")
    this.localStorage.remove("server")
    this.router.navigateByUrl("/")
    window.location.reload();
  }

  private removePlayer(id: string, nextPlayer: number) {
    this.players = this.players.filter(p => p.id != id)
    this.setHasTurn(this.players[nextPlayer].id)
  }

}

@Component({
  selector: 'steal-dialog',
  templateUrl: 'steal-dialog.html',
})
export class StealDialog {

  constructor(
    public dialogRef: MatDialogRef<StealDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}