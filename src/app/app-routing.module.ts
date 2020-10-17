import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent }  from './game/game.component';
import { IdentifierComponent } from './identifier/identifier.component';

const routes: Routes = [
  {path: '', component: IdentifierComponent},
  {path: ':identifier', component: GameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
