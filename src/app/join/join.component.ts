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

  @Input()
  gameId = ""
  @Input()
  userId = ""

  inputGameId = ""
  inputUserId = ""

  ngOnInit(): void {
    this.inputGameId = this.cookieService.get("game-id") || ""
    this.inputUserId = this.cookieService.get("username")
    if (this.inputGameId != "" && this.inputUserId != "") {
      console.log("Recovering " + this.inputGameId + ":" + this.inputUserId)
      this.gameId = this.inputGameId
      this.userId = this.inputUserId
      this.messageEvent.emit({gameId: this.inputGameId, userId: this.inputUserId})
      this.eventService.emitLocalEvent({GameConfiguration: {id: this.gameId, username: this.userId}})
    }
  }

  joinGame() {
    this.playerService.joinGame(this.inputGameId, this.inputUserId).subscribe(
      data => {
        this.userId = this.inputUserId
        this.gameId = this.inputGameId

        this.messageEvent.emit({gameId: this.inputGameId, userId: this.inputUserId})
        this.eventService.emitLocalEvent({GameConfiguration: {id: this.gameId, username: this.userId}})
        this.cookieService.set("game-id", this.gameId)
        this.cookieService.set("username", this.userId)
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


}