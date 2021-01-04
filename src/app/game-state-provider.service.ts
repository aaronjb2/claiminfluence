import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameStateProviderService {

  constructor(private httpClient: HttpClient) { }

  getState(identifier: string): Observable<object> {
    return this.httpClient.get(`http://localhost:4848/getGameData/${identifier}`);
  }
}
