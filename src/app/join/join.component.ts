import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayerService } from '../player.service';
import { EventsService } from '../events.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {

  constructor(
    private playerService: PlayerService, 
    private eventService: EventsService, 
    private localStorage: LocalStorageService, 
    private router: Router
  ) { }

  gameId = ""
  userId = ""
  server = ""

  inputGameId = ""
  inputUserId = ""
  inputServer = ""

  ngOnInit(): void {
    this.inputGameId = this.localStorage.get("game-id") || ""
    this.inputUserId = this.localStorage.get("username") || ""
    this.inputServer = this.localStorage.get("server") || ""
    if (this.inputGameId != "" && this.inputUserId != "" && this.inputServer != "") {
      console.log(`Recovering ${this.inputGameId}:${this.inputUserId}:${this.inputServer}`)
      this.gameId = this.inputGameId
      this.userId = this.inputUserId
      this.server = this.inputServer
      this.router.navigateByUrl("/board")
      this.eventService.emitLocalEvent({GameConfiguration: {id: this.gameId, username: this.userId, server: this.server}})
    }
  }

  joinGame() {
    console.log(`Joining game ${this.inputGameId} as  ${this.inputUserId} on ${this.inputServer}`)
    this.playerService.joinGame(this.inputServer, this.inputGameId, this.inputUserId).subscribe(
      data => {
        this.userId = this.inputUserId
        this.gameId = this.inputGameId
        this.server = this.inputServer
        this.eventService.emitLocalEvent({GameConfiguration: {id: this.gameId, username: this.userId, server: this.server}})
        this.localStorage.set("game-id", this.gameId)
        this.localStorage.set("username", this.userId)
        this.localStorage.set("server", this.server)
        console.log("Joining game now")
        this.router.navigateByUrl("/board")
      }
    )
  }


  updateGameId(id: string) {
    this.inputGameId = id
  }

  updateUserId(id: string) {
    this.inputUserId = id
  }

  updateServer(server: string) {
    this.inputServer = server
  }

}