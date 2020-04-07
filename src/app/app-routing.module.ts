import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { GameBoardComponent } from './game-board/game-board.component'

const routes: Routes = [
  {
    path: 'admin', component: AdminComponent,
  }, 
  {
    path: 'board', component: GameBoardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
