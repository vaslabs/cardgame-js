import { Component, Input, OnInit } from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import { EventsService } from '../events.service';
@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.css']
})
export class HandComponent implements OnInit{

  constructor(private eventService: EventsService) { }
 
  ngOnInit(): void {
    this.eventService.currentMessage.subscribe(
      msg => {
        console.log("From Hand component: " + msg)
        if (msg.GotCard) {
          if (msg.GotCard.card.VisibleCard) {
            this.addCard(msg.GotCard.card.VisibleCard)
          }
        } else if (msg.GameConfiguration) {
          this.gameId = msg.GameConfiguration.id
          this.playerId = msg.GameConfiguration.username
        } else if (msg.PlayedCard) {
          this.cards = this.cards.filter(c => c.id != msg.PlayedCard.card.id)
        }
      }
    )
  }


   // MatPaginator Inputs
   length = 10;
   pageSize = 5;

   @Input()
   cards = []
 
   gameId = ""
   playerId = ""
   // MatPaginator Output
   pageEvent: PageEvent;

   addCard(visibleCard: any) {
     if (!this.cards.find(value => value.id == visibleCard.id)) {
      this.cards.push(visibleCard)
      this.eventService.emitLocalEvent({GameConfiguration: {id: this.gameId, username: this.playerId}})
     }
   }



}
