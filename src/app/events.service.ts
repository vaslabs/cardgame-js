import { Injectable, NgZone } from '@angular/core';
import { Observable, BehaviorSubject, Observer } from 'rxjs';
import { VectorClockService } from './vector-clock.service';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  defaultMessage: any = {}
  private messageSource = new BehaviorSubject(this.defaultMessage);
  currentMessage: Observable<any> = this.messageSource.asObservable();
  username = null;
  gameId = null;

  constructor(
    private _zone: NgZone, 
    private websocketService: WebsocketService,
    private vectorClock: VectorClockService
  ) { 
  }

  emitLocalEvent(event: any) {
    this.messageSource.next(event)
  }

  emitRemoteEvent(event: MessageEvent) {
    if (event.data != "") {
      const gameEvent = JSON.parse(event.data)
      if (this.isFutureEvent(gameEvent)) {
        this.messageSource.next(gameEvent)
      }
      this.vectorClock.tickClocks(this.username, gameEvent.vectorClock, gameEvent.serverClock, this.gameId)
    }
  }

  isFutureEvent(event): boolean {
    return event.serverClock > this.vectorClock.serverClock[this.gameId]
  }

  streamGameEvents(username: string, gameId: string): Observable<any> {
    this.username = username
    this.gameId = gameId
    console.log(`Streaming game events for ${username}, ${gameId}`)
    const observable = new Observable(
      (observer: Observer<any>) => {
        observer.next = event => {
          this._zone.run(() => {
            this.emitRemoteEvent(event)
          });
        };

        observer.error = error => {
          this._zone.run( () => {
            observer.error(error)
          });
        };
        this.websocketService.subject.subscribe(observer);
       
      }
    )
    return observable
  }
}
