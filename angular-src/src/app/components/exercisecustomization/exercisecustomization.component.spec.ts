import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisecustomizationComponent } from './exercisecustomization.component';

describe('ExercisecustomizationComponent', () => {
  let component: ExercisecustomizationComponent;
  let fixture: ComponentFixture<ExercisecustomizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExercisecustomizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercisecustomizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
