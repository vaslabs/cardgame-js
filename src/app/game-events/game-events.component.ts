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
             this.startEvents(msg.GameConfiguration.server, msg.GameConfiguration.id)
           }
         }
    )
  }

  events = [];

  startEvents(server: string, gameId: string): void {
    this._eventsService.getGameEvent(server + "/events/vaslabs")
      .subscribe((data: MessageEvent) => {
        if (data.data != "")
          this.events.push(data.data)
      }
    );
  }


  

}
