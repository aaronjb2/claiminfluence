import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  getSquareklesState(identifier: string): Observable<object> {
    if (this.local) {
      return this.httpClient.get(`http://localhost:8080/getSquareklesGameData/${identifier}`);
    }
    return this.httpClient.get(`https://aaronjbraithwaiteapplications-atkqo.ondigitalocean.app/getSquareklesGameData/${identifier}`);
  }
}
