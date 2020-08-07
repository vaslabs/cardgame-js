import { Injectable, NgZone } from '@angular/core';
import {SseService} from './sse.service'
import { Observable, BehaviorSubject } from 'rxjs';
import { VectorClockService } from './vector-clock.service';
import { tick } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private _zone: NgZone, 
    private _sseService: SseService,
    private vectorClock: VectorClockService
  ) { }

  defaultMessage: any = {}
  private messageSource = new BehaviorSubject(this.defaultMessage);
  currentMessage = this.messageSource.asObservable();
  username = null;

  emitLocalEvent(event: any) {
    this.messageSource.next(event)
  }

  emitRemoteEvent(event: MessageEvent) {
    if (event.data != "") {
      const gameEvent = JSON.parse(event.data)
      if (this.isFutureEvent(gameEvent)) {
        this.messageSource.next(gameEvent)
      }
      this.vectorClock.tickClocks(this.username, gameEvent.vectorClock, gameEvent.serverClock)
    }
  }

  isFutureEvent(event): boolean {
    return event.serverClock > this.vectorClock.serverClock
  }

  getGameEvent(url: string, username) {
    this.username = username
    return Observable.create(
      observer => {
        const eventSource = this._sseService.getEventSource(url);
        
        eventSource.onmessage = event => {
          this._zone.run(() => {
            this.emitRemoteEvent(event)
            observer.next(event)
          });
        };

        eventSource.onerror = error => {
          this._zone.run( () => {
            observer.error(error)
          });
        };
      }
    )
  }
}
