import { Injectable, OnDestroy } from '@angular/core';
import { retryBackoff } from 'backoff-rxjs';
import { Observable, Subject, Observer, Subscription, BehaviorSubject, throwError } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, distinctUntilChanged, finalize, share } from 'rxjs/operators';

export enum ConnectionStatus {
  connected = 'connected',
  connecting = 'connecting',
  disconnected = 'disconnected'
}
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private websocket$: WebSocketSubject<any>;
  private messageStream$: Observable<any>;
  private connectionStatus$ = new BehaviorSubject<ConnectionStatus>(
    ConnectionStatus.connecting
  );
  constructor() {
  }

  connect(url: string) {
    if (!this.websocket$) {
      console.log(`Connecting to game websocket ${url}`)
      this.websocket$ = this.create(url);
      this.messageStream$ = this.websocket$.pipe(
        catchError((error: Error) => {
          this.connectionStatus$.next(ConnectionStatus.connecting);
          return throwError(JSON.stringify(error));
        }),
        retryBackoff(1000),
        finalize(() =>
          this.connectionStatus$.next(ConnectionStatus.disconnected)
        ),
        share()
      );
    }
  }
  public getMessageStream(): Observable<any>{
    return this.messageStream$;
  }

  sendMessage(event: any): void {
    console.log(`Actually sending ${JSON.stringify(event)} to ${this.websocket$}`)
    this.websocket$?.next(event);
  }

  public getConnectionStatus(): Observable<ConnectionStatus> {
    return this.connectionStatus$.pipe(distinctUntilChanged());
  }

  private create(url: string): WebSocketSubject<any> {
    return webSocket({
      url: url,
      openObserver: {
        next: () => {
          this.connectionStatus$.next(ConnectionStatus.connected);
        }
      }
    });
  }
}
