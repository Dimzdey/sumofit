import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-newworkout',
  templateUrl: './newworkout.component.html',
  styleUrls: ['./newworkout.component.css']
})
export class NewworkoutComponent implements OnInit {
  private Exercises = [];

  constructor() { }

  ngOnInit() {
  }

  AddExercise() {
    this.Exercises.push({});
  }

  CreateWorkout() {
    console.log(this.Exercises);
  }

}
