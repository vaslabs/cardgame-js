import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../player.service';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.css']
})
export class DiceComponent implements OnInit {

  constructor(private playerService: PlayerService, private eventService: EventsService) { }

  sides = 6
  numberOfDice = 2
  minDice = 1
  localplayer = undefined
  gameId = ""
  results = []

  ngOnInit(): void {
    this.eventService.currentMessage.subscribe(
      (msg: any) => {
        const gameConf = msg.GameConfiguration
        if (gameConf) {
          this.localplayer = gameConf.username
          this.gameId = gameConf.id
        } else if (msg.DiceThrow) {
          this.results = msg.DiceThrow.dice
        }
      }
    )
  }

  throw() {
    const action = {ThrowDice: {player: this.localplayer, numberOfDice: this.numberOfDice, sides: this.sides}}
    this.playerService.action(
      action, 
      this.gameId
    ).subscribe(
      msg => console.log(JSON.stringify(msg))
    )
  }

}
