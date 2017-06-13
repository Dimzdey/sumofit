import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ApiService} from '../../services/api.service';
import {ChatService} from '../../services/chat.service';
import {SocketService} from '../../services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers : [ChatService, SocketService]

})
export class ChatComponent implements OnInit {
    chats: [String];
    fromUser: String;
    messages: [String];
    selectedUserId: String;
    userId: String;

    selfClass = true;
    otherClass = false;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private chatservice: ChatService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    this.chatservice.getChats().subscribe(data => {
      this.chats = data.users;
    });
    this.authService.getProfile().subscribe(data => {
      this.fromUser = data.user._id;
    });
    this.socketService.connectSocket(this.fromUser);
  }

  selectChat(id) {
    const body = {toUser : id};
    this.selectedUserId = id;
    this.chatservice.getMessages(body).subscribe(data => {
      this.messages = data.messages;
    });
  }

  isUserSelected(userId) {
    if (!this.selectedUserId) {
      return false;
    }
    return this.selectedUserId === userId ? true : false;
  }

  alignMessage(userId) {
    if (this.fromUser === userId) {
      const classes = {self: !this.selfClass, other: this.otherClass};
      return classes;
    } else {
      const classes = {self: this.selfClass, other: !this.otherClass};
      return classes;
    }

  }

}
