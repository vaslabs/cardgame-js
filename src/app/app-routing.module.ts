import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { GameBoardComponent } from './game-board/game-board.component'
import { SetupGameComponent } from './setup-game/setup-game.component';

const routes: Routes = [
  {
    path: 'admin', component: AdminComponent,
  }, 
  {
    path: 'board', component: GameBoardComponent
  }, 
  {
    path: 'setup', component: SetupGameComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
