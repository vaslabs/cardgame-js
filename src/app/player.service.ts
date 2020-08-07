import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventsService } from './events.service';
import { VectorClockService } from './vector-clock.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  authority: string = ""
  username: string = null

  constructor(private http: HttpClient, private vectorClock: VectorClockService) { 

  }



  joinGame(server: string, gameId: string, username: string) {
    this.authority = server;
    const uri = this.authority + "/game/" + gameId + "/join?username=" + username
    this.username = username
    this.vectorClock.tick(username)
    return this.http.post(uri, {})
  }

  recoverGame(server: string, gameId: string, username: string) {
    this.authority = server
    const uri = server + "/game/" + gameId + "/" + username
    this.username = username
    this.vectorClock.tick(username)
    return this.http.get(uri)
  }

  action(action: any, gameId: string) {
    if (this.username) {
      action.vectorClock = this.vectorClock.tick(this.username)
    }
    const uri = this.authority + "/action/" + gameId
    return this.http.post(uri, action)
  }

}
