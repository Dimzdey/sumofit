import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

    private BASE_URL = 'http://localhost:2000';
    private socket;

  constructor() { }

  connectSocket(userId: string) {
    this.socket = io(this.BASE_URL, { query: `userId=${userId}`});
  }

  sendMessage(message: any): void {
    this.socket.emit('add-message', message);
  }

  receiveMessages(): any {
    const observable = new Observable(observer => {
      this.socket.on('add-message-response', (data) => {
          observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  
}
