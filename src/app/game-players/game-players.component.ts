import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-game-players',
  templateUrl: './game-players.component.html',
  styleUrls: ['./game-players.component.css']
})
export class GamePlayersComponent implements OnInit {

  constructor(private eventService: EventsService, private playerService: PlayerService) { }

  players = []
  private playerById = {}
  gameId = ""
  private localplayer = ""
  gameStarted = false

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
          this.playerService.recoverGame(this.gameId, this.localplayer)
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

}
