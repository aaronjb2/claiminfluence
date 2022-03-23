import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket: any;
  local = true;

  constructor() {
    this.socket = io(this.local ? 'ws://localhost:8080' : 'https://aaronjbraithwaiteapplications-atkqo.ondigitalocean.app', {
      withCredentials: true,
      extraHeaders: {
        'my-custom-header': 'abcd'
      }
    });
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
