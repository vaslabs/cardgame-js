import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class VectorClockService {

  vectorClock: { [key:string]:number; } = {}
  serverClock: number = 0


  constructor(private cookieService: CookieService) {
    this.recover()
  }

  tick(me: string): { [key:string]:number; } {
    if (this.vectorClock[me] >= 0)
      this.vectorClock[me]++
    else
      this.vectorClock[me] = 1
    this.persist()
    return this.vectorClock
  }

  tickClocks(me: string, clocks: { [key:string]:number; }, serverClock: number): { [key:string]:number; } {
    Object.keys(clocks).forEach(key => {
      if (this.vectorClock[key] >= 0) {
        const value = this.vectorClock[key]
        this.vectorClock[key] = Math.max(clocks[key], value)
      } else {
        this.vectorClock[key] = clocks[key]
      }
    });
    this.serverClock = Math.max(this.serverClock, serverClock)
    this.tick(me)
    this.persist()
    return this.vectorClock
  }

  persist() {
    this.cookieService.set("vector-clock", JSON.stringify(this.vectorClock))
    this.cookieService.set("server-clock", this.serverClock.toString())
  }

  recover() {
    const vectorClock: string = this.cookieService.get("vector-clock")
    const serverClock: string = this.cookieService.get("server-clock")
    if (vectorClock)
      this.vectorClock = JSON.parse(vectorClock)
    if (serverClock)
      this.serverClock = parseInt(serverClock)
  }
}
