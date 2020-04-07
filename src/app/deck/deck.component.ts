import { Component, OnInit, Input } from '@angular/core';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent implements OnInit {

  @Input()
  deck = {cards: []}
  @Input()
  localplayer: string = null
  @Input()
  gameId: string = null

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
  }

  drawCard() {
    if (this.localplayer && this.gameId) {
      const action = { DrawCard: {player: this.localplayer}}
      this.playerService.action(action, this.gameId).subscribe(
        (event: any) => {
          if (event.GotCard) {
            this.deck.cards.pop()
          }
        }
      )
    }
  }


}
