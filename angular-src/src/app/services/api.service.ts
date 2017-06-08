import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthService } from '../services/auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
    isDev: boolean;
    ad: any;
  constructor(private authService: AuthService, private http: Http) {
    this.isDev = false;
   }

    postAd(ad) {
      const headers = new Headers();
      this.authService.loadToken();
      headers.append('Authorization', this.authService.authToken);
      headers.append('Content-Type', 'application/json');
      const ep = this.prepEndpoint('api/ad');
      return this.http.post(ep, ad, {headers: headers})
        .map(res => res.json());
    }

    getAds() {
      const headers = new Headers();
      this.authService.loadToken();
      headers.append('Authorization', this.authService.authToken);
      headers.append('Content-Type', 'application/json');
      const ep = this.prepEndpoint('api/ad');
      return this.http.get(ep, {headers: headers})
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
