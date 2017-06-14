import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ApiService} from '../../services/api.service';
import {ChatService} from '../../services/chat.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';

@Component({
  selector: 'app-exercisecustomization',
  templateUrl: './exercisecustomization.component.html',
  styleUrls: ['./exercisecustomization.component.css']
})
export class ExercisecustomizationComponent implements OnInit {
  @Input('data') data: any;
  @Output() dataChange = new EventEmitter();

 exercises: [String];
  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private apiService: ApiService,
    private chatservice: ChatService
  ) { }

  ngOnInit() {
    this.data = this.data || {first: '', second: 0};
    this.apiService.getExercises().subscribe(data => {
      this.exercises = data.exercises;
    });
  }

  change() {
    this.dataChange.emit(this.data);
  }

  onChange(id) {
    console.log(id);
  }

}
