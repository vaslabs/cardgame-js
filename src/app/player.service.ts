import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventsService } from './events.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  authority: string = ""

  constructor(private http: HttpClient) { 

  }



  joinGame(server: string, gameId: string, username: string) {
    this.authority = server;
    const uri = this.authority + "/game/" + gameId + "/join?username=" + username
    return this.http.post(uri, {})
  }

  recoverGame(server: string, gameId: string, username: string) {
    this.authority = server
    const uri = server + "/game/" + gameId + "/" + username
    return this.http.get(uri)
  }

  action(action: any, gameId: string) {
    const uri = this.authority + "/action/" + gameId
    return this.http.post(uri, action)
  }
}
