import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-newworkout',
  templateUrl: './newworkout.component.html',
  styleUrls: ['./newworkout.component.css']
})

export class NewworkoutComponent implements OnInit {
  private Exercises = [];
  private workouts = [];
  private name: String = '';
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getWorkouts().subscribe(data => {
      this.workouts = data.workouts;
    }, err => {

    });
  }

  AddExercise() {
    this.Exercises.push({});
  }

  removeExercise(exercise) {
    const ind = this.Exercises.indexOf(exercise);
    this.Exercises.splice(ind, 1);
  }

  CreateWorkout() {
    const exercises = this.Exercises;
    const name = this.name;
    this.apiService.postWorkout({exercises, name}).subscribe(data => {
    });
    location.reload();
  }

}