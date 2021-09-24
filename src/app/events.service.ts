import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Observer } from 'rxjs';
import { VectorClockService } from './vector-clock.service';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {



  defaultMessage: any = {}
  private localMessageSource = new BehaviorSubject(this.defaultMessage);
  localMessage: Observable<any> = this.localMessageSource.asObservable();
  username = null;
  gameId = null;

  constructor(
    private _zone: NgZone, 
    private websocketService: WebsocketService,
    private vectorClock: VectorClockService
  ) { 
  }

  connect(url: string, username, gameId) {
    this.username = username
    this.gameId = gameId
    this.websocketService.connect(url);
  }

  emitLocalEvent(event: any) {
    this.localMessageSource.next(event)
  }

  emitRemoteEvent(gameEvent) {
    if (gameEvent && this.username && this.gameId) {
      console.log(`Emitting ${JSON.stringify(gameEvent)}?`)
      this.websocketService.sendMessage(gameEvent)
    }
  }

  isFutureEvent(event): boolean {
    return event.serverClock === undefined || event.serverClock > this.vectorClock.serverClock[this.gameId]
  }

  streamRemoteEvents(): Observable<any> {
    return this.websocketService.getMessageStream()
  }

  streamLocalEvents(): Observable<any> {
    return this.localMessage;
  }
}
