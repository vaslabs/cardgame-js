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
  gameId: string = null
  keyPair = null
  publicKeyHeaderValue: string;

  constructor(
    private http: HttpClient, 
    private vectorClock: VectorClockService, 
    private eventsService: EventsService,
    private localStorageService: LocalStorageService) { 
  }

 action(actionPayload: any) {
    console.log(`Actioning ${JSON.stringify(actionPayload)}`)
    if (this.username) {
      actionPayload.vectorClock = this.vectorClock.tick(this.username)
      actionPayload.serverClock = this.vectorClock.serverClock[this.gameId]
    }
    const signedEvent = this.sign(actionPayload)
    console.log(`Signed event is ${JSON.stringify(signedEvent)}`)
    this.eventsService.emitRemoteEvent(signedEvent)
  }

  joinGame(server: string, gameId: string, username: string) {
    this.initialiseKeyPair();
    this.authority = server;
    const uri = `${this.authority}/game/${gameId}/join`
    this.username = username
    this.gameId = gameId
    this.vectorClock.tickClocks(username, {}, 0, gameId)
    const payload = {
      JoinGame: {
        player: {
          id: this.username, 
          publicKey: this.publicKeyHeaderValue
        }
      }, 
      vectorClock: this.vectorClock.vectorClock, 
      serverClock: this.vectorClock.serverClock[gameId] || 0
    } 
    return this.http.post(uri, this.sign(payload))
  }

  private connectToPlayingEvents = (server, gameId, username) => {
    const websocketUri = server.replace("http://", "ws://").replace("https://", "wss://")

    this.username = username;
    this.authority = server;
    console.log("Connecting...")
    this.eventsService.connect(
      `${websocketUri}/live/actions/${gameId}/${username}`,
      username,
      gameId
    )

    console.log("Streaming started")

    console.log(`Authorising ${this.username}`)
    this.action({Authorise: {playerId: this.username}})

  }

  recoverGame(server: string, gameId: string, username: string) {
    this.initialiseKeyPair();

    this.authority = server
    const uri = server + "/game/" + gameId + "/" + username
    this.username = username
    this.gameId = gameId
    this.vectorClock.tick(username)
    this.connectToPlayingEvents(server, gameId, username)

    return this.http.get(uri)
  }


  private sign(action: any) {
    console.log(`Signing ${JSON.stringify(action)}`)
    const sig = new Crypto.KJUR.crypto.Signature({"alg": "SHA256withRSA"});
    sig.init(this.keyPair.privateKey);   // rsaPrivateKey of RSAKey object
    const signThis = JSON.stringify(action)
    sig.updateString(signThis)

    const sigValueHex = sig.sign()
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
      const keyPair = Crypto.KEYUTIL.generateKeypair(keyalg, keylen)
      const privateKeyFormat = Crypto.KEYUTIL.getPEM(keyPair.prvKeyObj, "PKCS8PRV");
      this.localStorageService.set("private-key", privateKeyFormat)
      this.publicKeyHeaderValue = this.publicKeyNoSpaces(Crypto.KEYUTIL.getPEM(keyPair.pubKeyObj));
      this.localStorageService.set("public-key", this.publicKeyHeaderValue)
      this.keyPairFromLocalStorage()
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
    return btoa(value.replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "").replace(/\s+/g, '').trim())
  }



}
