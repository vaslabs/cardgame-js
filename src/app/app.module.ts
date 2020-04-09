import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './admin/admin.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { GameEventsComponent } from './game-events/game-events.component';
import {MatListModule} from '@angular/material/list';
import { GameBoardComponent } from './game-board/game-board.component';
import { GamePlayersComponent } from './game-players/game-players.component';
import { DeckComponent } from './deck/deck.component';
import { HandComponent } from './hand/hand.component';
import { DiscardPileComponent } from './discard-pile/discard-pile.component';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import { VisibleCardComponent } from './visible-card/visible-card.component';
import { JoinComponent } from './join/join.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CookieService} from 'ngx-cookie-service'
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StealDialog} from './game-players/game-players.component';
import {ScrollingModule} from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    GameEventsComponent,
    GameBoardComponent,
    GamePlayersComponent,
    DeckComponent,
    HandComponent,
    DiscardPileComponent,
    VisibleCardComponent,
    JoinComponent,
    StealDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatGridListModule,
    MatFormFieldModule,
    MatButtonModule,
    HttpClientModule,
    MatListModule,
    MatCardModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ScrollingModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  entryComponents: [StealDialog]
})
export class AppModule { }
