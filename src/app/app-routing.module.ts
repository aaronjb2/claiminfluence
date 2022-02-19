import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfluenceGameComponent }  from './game/influence-game.component';
import { IdentifierComponent } from './identifier/identifier.component';

const routes: Routes = [
  {path: '', component: IdentifierComponent},
  {path: 'influence/:identifier', component: InfluenceGameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
