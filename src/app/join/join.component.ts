import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayerService } from '../player.service';
import { EventsService } from '../events.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {

  constructor(private playerService: PlayerService, private eventService: EventsService, private cookieService: CookieService) { }

  gameId = ""
  userId = ""
  server = ""

  inputGameId = ""
  inputUserId = ""
  inputServer = ""

  ngOnInit(): void {
    this.inputGameId = this.cookieService.get("game-id") || ""
    this.inputUserId = this.cookieService.get("username") || ""
    this.inputServer = this.cookieService.get("server") || ""
    if (this.inputGameId != "" && this.inputUserId != "" && this.inputServer != "") {
      console.log("Recovering " + this.inputGameId + ":" + this.inputUserId + ":" + this.inputServer)
      this.gameId = this.inputGameId
      this.userId = this.inputUserId
      this.server = this.inputServer
      this.eventService.emitLocalEvent({GameConfiguration: {id: this.gameId, username: this.userId, server: this.server}})
    }
  }

  joinGame() {
    console.log("Joining game " + this.inputGameId + " as " + this.inputUserId + " on " + this.inputServer)
    this.playerService.joinGame(this.inputServer, this.inputGameId, this.inputUserId).subscribe(
      data => {
        this.userId = this.inputUserId
        this.gameId = this.inputGameId
        this.server = this.inputServer

        this.eventService.emitLocalEvent({GameConfiguration: {id: this.gameId, username: this.userId, server: this.server}})
        this.cookieService.set("game-id", this.gameId)
        this.cookieService.set("username", this.userId)
        this.cookieService.set("server", this.server)
      }
    )
  }

  @Output() messageEvent = new EventEmitter<any>();


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