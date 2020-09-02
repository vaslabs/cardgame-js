import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VectorClockService } from './vector-clock.service';
import {WebsocketService} from './websocket.service';
import { Subject } from 'rxjs';
import { EventsService } from './events.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  authority: string = ""
  username: string = null
  actionEvents: Subject<MessageEvent> = null

  constructor(private http: HttpClient, private vectorClock: VectorClockService, private websocketService: WebsocketService, private eventsService: EventsService) { 

  }



  joinGame(server: string, gameId: string, username: string) {
    this.authority = server;
    const uri = this.authority + "/game/" + gameId + "/join?username=" + username
    this.username = username
    this.vectorClock.tickClocks(username, {}, 0, gameId)
    this.connectToPlayingEvents(server, gameId, username)
    return this.http.post(uri, {})
  }

  private connectToPlayingEvents = (server, gameId, username) => {
    const websocketUri = server.replace("http://", "ws://").replace("https://", "wss://")

    this.actionEvents = this.websocketService.connect(websocketUri + `/live/actions/${gameId}/${username}`)

    this.eventsService.streamGameEvents(username, gameId).subscribe((event: any) => console.log(JSON.stringify(event)))
   
  }

  recoverGame(server: string, gameId: string, username: string) {
    this.authority = server
    const uri = server + "/game/" + gameId + "/" + username
    this.username = username
    this.vectorClock.tick(username)
    this.connectToPlayingEvents(server, gameId, username)

    return this.http.get(uri)
  }

  action(action: any) {
    
    if (this.username) {
      action.vectorClock = this.vectorClock.tick(this.username)
    }
    this.actionEvents.next(action)
  }

}
