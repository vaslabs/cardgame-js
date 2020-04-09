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

  server = ""
 
  ngOnInit(): void {
    this.eventService.currentMessage.subscribe(
      msg => {
        if (msg.GotCard) {
          if (msg.GotCard.card.VisibleCard) {
            this.addCard(msg.GotCard.card.VisibleCard)
          }
        } else if (msg.GameConfiguration) {
          this.gameId = msg.GameConfiguration.id
          this.playerId = msg.GameConfiguration.username
          this.server = msg.GameConfiguration.server
        } else if (msg.PlayedCard) {
          this.cards = this.cards.filter(c => c.id != msg.PlayedCard.card.id)
        } else if (msg.RecoverHand) {
          msg.RecoverHand.forEach(card => this.addCard(card.VisibleCard))
        } else if (msg.MoveCard && msg.MoveCard.card.HiddenCard && msg.MoveCard.from == this.playerId) {
          this.removeCard(msg.MoveCard.card.HiddenCard.id)
        } else if (msg.MoveCard && msg.MoveCard.card.VisibleCard && msg.MoveCard.from == this.playerId) {
          this.removeCard(msg.MoveCard.card.VisibleCard.id)
        } 
        else if (msg.MoveCard && msg.MoveCard.card.VisibleCard && msg.MoveCard.to == this.playerId) {
          this.addCard(msg.MoveCard.card.VisibleCard)
        } else if (msg.BorrowedCard && msg.BorrowedCard.card.VisibleCard) {
          this.borrowCard(msg.BorrowedCard.card.VisibleCard)
        } else if (msg.ReturnedCard) {
          this.removeCard(msg.ReturnedCard.card)
        } else if (msg.BackToDeck) {
          const card = msg.BackToDeck.card
          if (card.VisibleCard) {
            this.removeCard(card.VisibleCard.id)
          } else if (card.HiddenCard.id) {
            this.removeCard(card.HiddenCard.id)
          }
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
     }
   }

   borrowCard(visibleCard: any) {
     visibleCard.borrowed = true
     this.addCard(visibleCard)
   }

   removeCard(id: string) {
     this.cards = this.cards.filter(value => value.id != id)
   }



}
