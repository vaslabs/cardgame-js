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
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StealDialog} from './game-players/game-players.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { PutCardBackDialogComponent } from './visible-card/put-card-back-dialog/put-card-back-dialog.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import { AllCardsViewComponent } from './discard-pile/all-cards-view/all-cards-view.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatIconModule} from '@angular/material/icon';
import { EventShowerComponent } from './game-board/event-shower/event-shower.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SetupGameComponent } from './setup-game/setup-game.component';
import { DiceComponent } from './dice/dice.component';
import { ViewCardComponent } from './visible-card/view-card/view-card.component';
import {MatBadgeModule} from '@angular/material/badge';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FlexLayoutModule } from '@angular/flex-layout';

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
    StealDialog,
    PutCardBackDialogComponent,
    AllCardsViewComponent,
    EventShowerComponent,
    SetupGameComponent,
    DiceComponent,
    ViewCardComponent
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
    ScrollingModule,
    MatSlideToggleModule,
    MatInputModule,
    MatBottomSheetModule,
    MatIconModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatAutocompleteModule,
    FlexLayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [StealDialog]
})
export class AppModule { }
