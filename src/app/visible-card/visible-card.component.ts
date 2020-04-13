import { Component, OnInit, Input } from '@angular/core';
import { PlayerService } from '../player.service';
import { EventsService } from '../events.service';
import { PutCardBackDialogComponent } from './put-card-back-dialog/put-card-back-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface PatchDeck {
  index: number
  cardId: string
}

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
  @Input() borrowed = false

  private deckSize = 0

  constructor(private playerService: PlayerService, private eventService: EventsService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.eventService.currentMessage.subscribe(
      msg =>
        {
          if (msg.GameConfiguration) {
            this.gameId = msg.GameConfiguration.id
            this.playerId = msg.GameConfiguration.username
          } else if (msg.DeckSize) {
            this.deckSize = msg.DeckSize.value
          }
        }
    )
  }


  play() {
    if (this.cardId != "" && this.playerId != "" && this.gameId != "") {
      const action = {PlayCard: {card: this.cardId, player: this.playerId}}
      this.playerService.action(action, this.gameId).subscribe(
        playedCard =>
          console.log("Playing " + JSON.stringify(playedCard))
      )
    } else {
      console.log("Card id is empty")
    }
  }

  returnToDeck() {
    const action = {ReturnCard: {player: this.playerId, cardId: this.cardId}}
    this.playerService.action(action, this.gameId).subscribe(
      msg =>
        console.log("Returning " + JSON.stringify(msg))
    )
  }

  putBackToDeck(card: any, position: number) {
    const action = {PutCardBack: {card: card, player: this.playerId, index: position}}
    this.playerService.action(action, this.gameId).subscribe(
      msg =>
        console.log("Put back to deck " + JSON.stringify(msg))
    )
    console.log("Returning card " + JSON.stringify(card) + " to " + position)
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PutCardBackDialogComponent, {
      width: '400px',
      data: {index: 0, maxIndex: this.deckSize, visible: false}
    });

    dialogRef.afterClosed().subscribe(result => {
      const card = {id: this.cardId, image: this.cardImage}
      if (result.visible) {
        this.putBackToDeck({VisibleCard: card}, result.index)
      } else {
        this.putBackToDeck({HiddenCard: card}, result.index)
      }
    });
  }

}
