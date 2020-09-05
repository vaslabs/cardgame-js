import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-setup-game',
  templateUrl: './setup-game.component.html',
  styleUrls: ['./setup-game.component.css']
})
export class SetupGameComponent implements OnInit {

  constructor(private route: ActivatedRoute, private localStorage: LocalStorageService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        const gameId = params["game-id"]
        const server = params["server"]
        if (gameId && server) {
          this.localStorage.set("game-id", gameId)
          this.localStorage.set("server", server)
          const username = params["username"] 
          if (username) {
            this.localStorage.set("username", username)
          }
          this.router.navigateByUrl("/")
        }
      }
    )
  }

}
