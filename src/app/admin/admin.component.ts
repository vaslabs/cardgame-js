import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

  createdGame = "";
  authToken = "";

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
  }

  createGame() {
    this.adminService.createGame(this.authToken).subscribe(
      (data: string) =>
        this.createdGame = data
    )
  }

  update(token: string) {
    this.authToken = token;
  }
}
