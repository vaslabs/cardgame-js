import { Injectable, NgZone } from '@angular/core';
import {SseService} from './sse.service'
import { Observable, BehaviorSubject } from 'rxjs';
import { VectorClockService } from './vector-clock.service';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private _zone: NgZone, 
    private websocketService: WebsocketService,
    private vectorClock: VectorClockService
  ) { }

  defaultMessage: any = {}
  private messageSource = new BehaviorSubject(this.defaultMessage);
  currentMessage = this.messageSource.asObservable();
  username = null;
  gameId = null;

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
    return event.serverClock > this.vectorClock.serverClock
  }

  streamGameEvents(username: string, gameId: string) {
    this.username = username
    this.gameId = gameId
    const observable = Observable.create(
      observer => {
        observer.next = event => {
          console.log("On message")
          this._zone.run(() => {
            this.emitRemoteEvent(event)
          });
        };

        observer.onerror = error => {
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
