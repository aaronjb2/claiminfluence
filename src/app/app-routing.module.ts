import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfluenceGameComponent }  from './influence-game/influence-game.component';
import { IdentifierComponent } from './identifier/identifier.component';
import { SquareklesGameComponent } from './squarekles-game/squarekles-game.component';

const routes: Routes = [
  {path: '', component: IdentifierComponent},
  {path: 'influence/:identifier', component: InfluenceGameComponent},
  {path: 'squarekles/:identifier', component: SquareklesGameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
