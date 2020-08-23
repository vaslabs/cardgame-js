import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-game-events',
  templateUrl: './game-events.component.html',
  styleUrls: ['./game-events.component.css']
})
export class GameEventsComponent implements OnInit {

  constructor(private _eventsService: EventsService) { }
  
  ngOnInit(): void {
    this._eventsService.currentMessage.subscribe(
      (msg: any) =>
         {
           if (msg.GameConfiguration) {
             this.startEvents(msg.GameConfiguration.username, msg.GameConfiguration.id)
           }
         }
    )
  }

  events = [];

  startEvents(username: string, gameId: string): void {
    this._eventsService.streamGameEvents(username, gameId)
      .subscribe((event) => {
          this.events.push(event)
      }
    );
  }


  

}
