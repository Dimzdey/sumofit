import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ApiService} from '../../services/api.service';

import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  ad: [Object];
  error: any;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router) { }

  ngOnInit() {
    this.apiService.getAds().subscribe(ads => {
      this.ad = ads.ads;
    },
    err => {
      const message = JSON.parse(err._body);
      this.error = message.message;
      return false;
    });
  }

}
