import { Component, OnInit, Inject } from '@angular/core';
import { EventsService } from '../events.service';
import { PlayerService } from '../player.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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

  constructor(private eventService: EventsService, private playerService: PlayerService, public dialog: MatDialog) { }

  players = []
  private playerById = {}
  gameId = ""
  localplayer = ""
  gameStarted = false
  server = ""

  ngOnInit(): void {
    this.eventService.currentMessage.subscribe(
      event => {
        if (event.NextPlayer) {
          this.setHasTurn(event.NextPlayer.player)
        } if (event.PlayerJoined) {
          this.storePlayer(event.PlayerJoined.id)
        } else if (event.GameConfiguration) {
          this.gameId = event.GameConfiguration.id
          this.localplayer = event.GameConfiguration.username
          this.server = event.GameConfiguration.server
          this.playerService.recoverGame(this.server, this.gameId, this.localplayer)
            .subscribe(
              (res: any) => {
                if (res.StartingGame) {
                  this.players = []
                  this.playerById = {}
                  res.StartingGame.playersJoined.forEach(p => this.storePlayer(p.id))
                  this.gameStarted = false
                } else if (res.StartedGame) {
                  this.players = []
                  this.playerById = {}
                  this.gameStarted = true
                  const currentPlayer = res.StartedGame.nextPlayer
                  res.StartedGame.players.forEach((p, index) => {
                      this.storePlayer(p.id)
                      if (index == currentPlayer) {
                        this.setHasTurn(p.id)
                      }
                      if (p.id == this.localplayer) {
                        this.eventService.emitLocalEvent({RecoverHand: p.hand})
                      }
                    }
                  );
                  this.eventService.emitLocalEvent(
                    {RecoverDiscardPile:{cards: res.StartedGame.discardPile.cards}}
                  );

                  this.eventService.emitLocalEvent(
                    {RecoverDeck: {deck: res.StartedGame.deck}}
                  );


                }
              }
            )
          this.storePlayer(this.localplayer)
        } else if (event.GameStarted) {
          this.gameStarted = true
          this.setHasTurn(event.GameStarted.startingPlayer)
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

  private storePlayer(playerId: string) {
    if (!this.playerById[playerId]) {
      const player = {id: playerId, hasTurn: false}
      this.players.push(player)
      this.playerById[playerId] = true
    }
  }

  chooseNext(next: string) {
    this.playerService.action({ChooseNextPlayer: {player: this.localplayer, next: next}}, this.gameId)
      .subscribe(
        (event: {NextPlayer: {player: string}}) =>
          this.setHasTurn(event.NextPlayer.player)
      )
  }

  steal(from: string, index: number) {
    console.log('Wants to steal ' + index + " from " + from);
    this.playerService.action({StealCard: {player: this.localplayer, from: from, cardIndex: index}}, this.gameId).subscribe(
      (msg: any) => {
        if (msg.MoveCard.card.VisibleCard) {
          this.eventService.emitLocalEvent({GotCard: {playerId: this.localplayer, card: msg.MoveCard.card}})
        }
      }
    )
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