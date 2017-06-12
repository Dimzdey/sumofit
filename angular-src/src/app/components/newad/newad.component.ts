import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-newad',
  templateUrl: './newad.component.html',
  styleUrls: ['./newad.component.css']
})

export class NewadComponent implements OnInit {
  pricePerOne: Number;
  pricePerMonth: Number;
  about: String;
  location: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
  }

  onFormSubmit() {
    const ad = {
      price_per_one: this.pricePerOne,
      price_per_month: this.pricePerMonth,
      details: this.about,
      location: this.location
    };

    this.apiService.postAd(ad).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.message, {
          cssClass: 'alert-success',
          timeout: 5000});
      }
      location.reload();
    }, err => {
      const message = JSON.parse(err._body);
      this.flashMessage.show(message.message, {
          cssClass: 'alert-danger',
          timeout: 5000});
    });
  }
}
