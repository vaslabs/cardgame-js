import { Injectable, NgZone } from '@angular/core';
import {SseService} from './sse.service'
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private _zone: NgZone, 
    private _sseService: SseService
  ) { }

  defaultMessage: any = {}
  private messageSource = new BehaviorSubject(this.defaultMessage);
  currentMessage = this.messageSource.asObservable();

  emitLocalEvent(event: any) {
    this.messageSource.next(event)
  }

  emitRemoteEvent(event: MessageEvent) {
    if (event.data != "") {
      const gameEvent = JSON.parse(event.data)
      this.messageSource.next(gameEvent)
    }
  }

  getGameEvent(url: string) {
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
