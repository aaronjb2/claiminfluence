import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ClickOutsideModule } from 'ng-click-outside';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InfluenceGameComponent } from './influence-game/influence-game.component';
import { IdentifierComponent } from './identifier/identifier.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { InfluenceAvatarComponent } from './influence-avatar/influence-avatar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SquareklesGameComponent } from './squarekles-game/squarekles-game.component';
import { SquarklesCardComponent } from './squarkles-card/squarkles-card.component';
import { SquarklesBonusComponent } from './squarkles-bonus/squarkles-bonus.component';
import { CoinExchangeCarrierComponent } from './coin-exchange-carrier/coin-exchange-carrier.component';
import { SquareklesDeckComponent } from './squarekles-deck/squarekles-deck.component';
import { SquarklesAvatarComponent } from './squarkles-avatar/squarkles-avatar.component';

@NgModule({
  declarations: [
    AppComponent,
    IdentifierComponent,
    InfluenceGameComponent,
    InfluenceAvatarComponent,
    SquareklesGameComponent,
    SquarklesCardComponent,
    SquarklesBonusComponent,
    CoinExchangeCarrierComponent,
    SquareklesDeckComponent,
    SquarklesAvatarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule
    // ClickOutsideModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
