import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  createGame(token: string) {
    const headers =  new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Accept': 'text/plain'
    });

    return this.http.post("http://localhost:8080/games-admin", {}, {headers: headers, responseType: 'text'})
  }
}
