import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  authority: string = "http://localhost:8080"

  constructor(private http: HttpClient) { }

  joinGame(gameId: string, username: string) {
    const uri = this.authority + "/game/" + gameId + "/join?username=" + username
    return this.http.post(uri, {})
  }

  recoverGame(gameId: string, username: string) {
    const uri = this.authority + "/game/" + gameId + "/" + username
    return this.http.get(uri)
  }

  action(action: any, gameId: string) {
    const uri = this.authority + "/action/" + gameId
    return this.http.post(uri, action)
  }
}
