import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-newworkout',
  templateUrl: './newworkout.component.html',
  styleUrls: ['./newworkout.component.css']
})

export class NewworkoutComponent implements OnInit {
  private Exercises = [];

  constructor(private apiService:ApiService) { }

  ngOnInit() {
  }

  AddExercise() {
    this.Exercises.push({});
  }

  CreateWorkout() {
    this.apiService.postWorkout(this.Exercises).subscribe(data => {
      console.log(data);
    });
    console.log(this.Exercises);
  }

}