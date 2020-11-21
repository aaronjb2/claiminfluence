import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ClickOutsideModule } from 'ng-click-outside';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { IdentifierComponent } from './identifier/identifier.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AvatarsGroupSixComponent } from './avatars-group-six/avatars-group-six.component';
import { AvatarsGroupFiveComponent } from './avatars-group-five/avatars-group-five.component';
import { AvatarsGroupFourComponent } from './avatars-group-four/avatars-group-four.component';
import { AvatarsGroupThreeComponent } from './avatars-group-three/avatars-group-three.component';
import { AvatarsGroupTwoComponent } from './avatars-group-two/avatars-group-two.component';
import { AvatarComponent } from './avatar/avatar.component';

@NgModule({
  declarations: [
    AppComponent,
    IdentifierComponent,
    GameComponent,
    AvatarsGroupSixComponent,
    AvatarsGroupFiveComponent,
    AvatarsGroupFourComponent,
    AvatarsGroupThreeComponent,
    AvatarsGroupTwoComponent,
    AvatarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    // ClickOutsideModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
