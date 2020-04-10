import { Component, OnInit, Inject } from '@angular/core';
import {MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { PlayerService } from 'src/app/player.service';

@Component({
  selector: 'app-all-cards-view',
  templateUrl: './all-cards-view.component.html',
  styleUrls: ['./all-cards-view.component.css']
})
export class AllCardsViewComponent implements OnInit {

  constructor(
    private playerService: PlayerService,
    private _bottomSheetRef: MatBottomSheetRef<AllCardsViewComponent>, 
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: DiscardPileData
  ) {
    
  }

  cards = []

  ngOnInit(): void {
  }

  recoverCard(cardId: string, $event: MouseEvent) {
    $event.preventDefault()
    this._bottomSheetRef.dismiss();

    this.playerService.action(
      {RecoverCard: {player: this.data.playerId, cardId: cardId}}, this.data.gameId
    ).subscribe(msg => console.log(msg))
  }

}

export interface DiscardPileData {
  cards: [any]
  playerId: string
  gameId: string
}
