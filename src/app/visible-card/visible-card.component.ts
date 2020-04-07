import { Component, OnInit, Input } from '@angular/core';
import { PlayerService } from '../player.service';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-visible-card',
  templateUrl: './visible-card.component.html',
  styleUrls: ['./visible-card.component.css']
})
export class VisibleCardComponent implements OnInit {

  @Input() cardId = ""
  @Input() cardImage = ""
  @Input() playerId = ""
  @Input() gameId = ""

  constructor(private playerService: PlayerService, private eventService: EventsService) { }

  ngOnInit(): void {
    this.eventService.currentMessage.subscribe(
      msg =>
        {
          if (msg.GameConfiguration) {
            this.gameId = msg.GameConfiguration.id
            this.playerId = msg.GameConfiguration.username
          }
        }
    )
  }


  play() {
    if (this.cardId != "" && this.playerId != "" && this.gameId != "") {
      const action = {PlayCard: {card: this.cardId, player: this.playerId}}
      this.playerService.action(action, this.gameId).subscribe(
        playedCard =>
          this.cardId = ""
      )
    } else {
      console.log("Card id is empty")
    }
  }



}
