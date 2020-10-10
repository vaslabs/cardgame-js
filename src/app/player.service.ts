import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VectorClockService } from './vector-clock.service';
import {WebsocketService} from './websocket.service';
import { Subject } from 'rxjs';
import { EventsService } from './events.service';
import * as Crypto from 'jsrsasign';
import {LocalStorageService} from './local-storage.service';
@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  authority: string = ""
  username: string = null
  actionEvents: Subject<MessageEvent> = null
  keyPair = null
  publicKeyHeaderValue: string;

  constructor(
    private http: HttpClient, 
    private vectorClock: VectorClockService, 
    private websocketService: WebsocketService, 
    private eventsService: EventsService,
    private localStorageService: LocalStorageService) { 
  }


  joinGame(server: string, gameId: string, username: string) {
    this.initialiseKeyPair();
    this.authority = server;
    const uri = this.authority + "/game/" + gameId + "/join?username=" + username
    this.username = username
    this.vectorClock.tickClocks(username, {}, 0, gameId)
    this.connectToPlayingEvents(server, gameId, username)
    return this.http.post(uri, {}, {headers: this.headers(this.publicKeyHeaderValue)})
  }

  private connectToPlayingEvents = (server, gameId, username) => {
    const websocketUri = server.replace("http://", "ws://").replace("https://", "wss://")

    this.actionEvents = this.websocketService.connect(websocketUri + `/live/actions/${gameId}/${username}`)

    this.eventsService.streamGameEvents(username, gameId).subscribe((event: any) => console.log(JSON.stringify(event)))
   
  }

  recoverGame(server: string, gameId: string, username: string) {
    this.initialiseKeyPair();

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
    this.actionEvents.next(this.sign(action))
  }

  private sign(action: any) {
    const sig = new Crypto.KJUR.crypto.Signature({"alg": "SHA256withRSA"});
    sig.init(this.keyPair.privateKey);   // rsaPrivateKey of RSAKey object
    
    const sigValueHex = sig.signString(JSON.stringify(action))
    action["signature"] = sigValueHex
    return action
  }

  private headers(publicKey: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + publicKey
    });
  }

  private initialiseKeyPair() {
    if (!this.keyPairFromLocalStorage()) {
      const keyalg = "RSA";
      const keylen = 1024;
      this.keyPair = Crypto.KEYUTIL.generateKeypair(keyalg, keylen)
      const privateKeyFormat = Crypto.KEYUTIL.getPEM(this.keyPair.prvKeyObj, "PKCS8PRV");
      this.localStorageService.set("private-key", privateKeyFormat)
      this.publicKeyHeaderValue = this.publicKeyNoSpaces(Crypto.KEYUTIL.getPEM(this.keyPair.pubKeyObj));
      this.localStorageService.set("public-key", this.publicKeyHeaderValue)
    }
  }

  private keyPairFromLocalStorage(): boolean {
    const privateKey = this.localStorageService.get("private-key")
    const publicKey = this.localStorageService.get("public-key")

    if (privateKey && publicKey) {
      const keyUtil = Crypto.KEYUTIL.getKeyFromPlainPrivatePKCS8PEM(privateKey)
      this.keyPair = {privateKey: keyUtil}
      this.publicKeyHeaderValue = publicKey
      return true
    } else {
      return false
    }
  }

  private publicKeyNoSpaces(value: string): string {
    return btoa(value.replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "").split("\n").join(""))
  }



}
