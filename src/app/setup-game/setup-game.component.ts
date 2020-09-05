import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-setup-game',
  templateUrl: './setup-game.component.html',
  styleUrls: ['./setup-game.component.css']
})
export class SetupGameComponent implements OnInit {

  constructor(private route: ActivatedRoute, private cookieService: CookieService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        const gameId = params["game-id"]
        const server = params["server"]
        if (gameId && server) {
          this.cookieService.set("game-id", gameId)
          this.cookieService.set("server", server)
          const username = params["username"] 
          if (username) {
            this.cookieService.set("username", username)
          }
          this.router.navigateByUrl("/")
        }
      }
    )
  }

}
