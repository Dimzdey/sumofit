import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ApiService} from '../../services/api.service';
import {ChatService} from '../../services/chat.service';
import {FlashMessagesService} from 'angular2-flash-messages';

import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  ad: [Object];
  error: any;
  message: String;
  toUser: String;
  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private apiService: ApiService,
    private chatservice: ChatService
    ) { }

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

  sendMessage(to) {
    const message = {message : this.message};
    this.chatservice.sendPrivateMessage(to, message).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.message, {
          cssClass: 'alert-success',
          timeout: 5000});
      }
    }, err => {
      const wnt = JSON.parse(err._body);
      this.flashMessage.show(wnt.message, {
          cssClass: 'alert-danger',
          timeout: 5000});
    });
  }

}
