import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {

  constructor(private playerService: PlayerService) { }

  @Input()
  gameId = ""
  @Input()
  userId = ""

  inputGameId = ""
  inputUserId = ""

  ngOnInit(): void {
  }

  joinGame() {
    this.playerService.joinGame(this.inputGameId, this.inputUserId).subscribe(
      data => {
        this.userId = this.inputUserId
        this.gameId = this.inputGameId
        this.messageEvent.emit({gameId: this.inputGameId, userId: this.inputUserId})
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