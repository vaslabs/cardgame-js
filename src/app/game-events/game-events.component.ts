import { Component, Input } from '@angular/core';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-game-events',
  templateUrl: './game-events.component.html',
  styleUrls: ['./game-events.component.css']
})
export class GameEventsComponent {

  constructor(private _eventsService: EventsService) { }

  events = [];
  

  startEvents(gameId: string): void {
    this._eventsService.getGameEvent("http://localhost:8080/events/vaslabs")
      .subscribe((data: MessageEvent) => {
        console.log(data)
        console.log(data.data)
      
        if (data.data != "")
          this.events.push(data.data)
      }
    );
  }

  @Input()
  set gameId(id: string) {
    if (id != "")
      this.startEvents(id);
  }

  

}
