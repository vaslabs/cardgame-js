import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class VectorClockService {

  vectorClock: { [key:string]:number; } = {}
  serverClock: { [key:string]:number; } = {}


  constructor(private localStorage: LocalStorageService) {
    this.recover()
  }

  tick(me: string): { [key:string]:number; } {
    console.log(`Ticking ${me} clock`)
    if (this.vectorClock[me] >= 0)
      this.vectorClock[me]++
    else
      this.vectorClock[me] = 1
    this.persistVectorClock()
    return this.vectorClock
  }

  tickClocks(me: string, clocks: { [key:string]:number; }, serverClock: number, gameId: string): { [key:string]:number; } {
    Object.keys(clocks).forEach(key => {
      if (this.vectorClock[key] >= 0 && clocks[key] >= 0) {
          const value = this.vectorClock[key]
          this.vectorClock[key] = Math.max(clocks[key], value)
      } else {
        this.vectorClock[key] = clocks[key]
      }
    });
    if (!this.serverClock[gameId]) {
      this.serverClock[gameId] = 0
    }
    this.serverClock[gameId] = Math.max(this.serverClock[gameId], serverClock)
    this.tick(me)
    this.persist(gameId)
    return this.vectorClock
  }

  persistVectorClock() {
    this.localStorage.set("vector-clock", JSON.stringify(this.vectorClock))
  }

  persist(gameId: string) {
    this.persistVectorClock()
    if (!this.serverClock[gameId])
      this.serverClock[gameId] = 0
    this.localStorage.set(`server-clock-${gameId}`, this.serverClock[gameId].toString())

  }

  recover() {
    const gameId = this.localStorage.get("game-id") 
    const vectorClock: string = this.localStorage.get("vector-clock")
    const serverClock: string = this.localStorage.get(`server-clock-${gameId}`)
    if (vectorClock)
      this.vectorClock = JSON.parse(vectorClock)
    if (serverClock)
      this.serverClock[gameId] = parseInt(serverClock) | 0
  }
}
