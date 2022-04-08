import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {SquarekleGame} from './squarekles-game/interfaces/squarekle-game';

@Injectable({
  providedIn: 'root'
})
export class GameStateProviderService {
  local = true;
  constructor(private httpClient: HttpClient) { }

  getInfluenceState(identifier: string): Observable<object> {
    if (this.local) {
      return this.httpClient.get(`http://localhost:8080/getInfluenceGameData/${identifier}`);
    }
    return this.httpClient.get(`https://aaronjbraithwaiteapplications-atkqo.ondigitalocean.app/getInfluenceGameData/${identifier}`);
  }

  getSquareklesState(game: SquarekleGame): Observable<object> {
    if (this.local) {
      return this.httpClient.post(`http://localhost:8080/getSquareklesGameData`, game);
    }
    return this.httpClient.post(`https://aaronjbraithwaiteapplications-atkqo.ondigitalocean.app`, game);
  }
}
