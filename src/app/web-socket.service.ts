import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket: any;
  readonly uri: string = 'https://aaronjbraithwaiteapplications-atkqo.ondigitalocean.app';
  // readonly uri: string = 'ws://localhost:8080';

  constructor() {
    this.socket = io(this.uri, {
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
