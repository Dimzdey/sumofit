import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthService } from '../services/auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatService {
    isDev: boolean;
    toUser: string;
    message: string;
  constructor(private authService: AuthService, private http: Http) {
    this.isDev = false;
   }

    getChats() {
      const headers = new Headers();
      this.authService.loadToken();
      headers.append('Authorization', this.authService.authToken);
      headers.append('Content-Type', 'application/json');
      const ep = this.prepEndpoint('chat/getchatlist');
      return this.http.get(ep, {headers: headers})
        .map(res => res.json());
    }

     getMessages(toUser) {
      const headers = new Headers();
      this.authService.loadToken();
      headers.append('Authorization', this.authService.authToken);
      headers.append('Content-Type', 'application/json');
      const ep = this.prepEndpoint('chat/getchatlist');
      return this.http.post(ep, toUser, {headers: headers})
        .map(res => res.json());
    }

    sendPrivateMessage(toUser, message) {
      const headers = new Headers();
      this.authService.loadToken();
      headers.append('Authorization', this.authService.authToken);
      headers.append('Content-Type', 'application/json');
      const ep = this.prepEndpoint(`chat/sendmessage/${toUser}`);
      return this.http.post(ep, message, {headers: headers})
        .map(res => res.json());
    }

   prepEndpoint(ep) {
      if (this.isDev) {
        return ep;
      } else {
        return 'http://localhost:3000/' + ep;
      }
   }
}
