import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private http: HttpClient) { }

  joinGame(gameId: string, username: string) {
    const uri = "http://localhost:8080/game/" + gameId + "/join?username=" + username
    return this.http.post(uri, {})
  }

  recoverGame(gameId: string, username: string) {
    const uri = "http://localhost:8080/game/" + gameId + "/" + username
    return this.http.get(uri)
  }
}
