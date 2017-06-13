import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-exercisecustomization',
  templateUrl: './exercisecustomization.component.html',
  styleUrls: ['./exercisecustomization.component.css']
})
export class ExercisecustomizationComponent implements OnInit {
  @Input('data') data: any;
  @Output() dataChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.data = this.data || {first: '', second: 0};
  }

  change() {
    console.log(this.data);
    this.dataChange.emit(this.data);
  }

}
