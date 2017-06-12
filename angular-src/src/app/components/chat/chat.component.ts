import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ApiService} from '../../services/api.service';
import {ChatService} from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
    chats: [String];
    fromUser: String;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private chatservice: ChatService
  ) { }

  ngOnInit() {
    this.chatservice.getChats().subscribe(data => {
      this.chats = data.users;
    });
    this.authService.getProfile().subscribe(data => {
      this.fromUser = data.user._id;
    });
  }

  

}
