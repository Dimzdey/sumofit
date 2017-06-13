import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewworkoutComponent } from './newworkout.component';

describe('NewworkoutComponent', () => {
  let component: NewworkoutComponent;
  let fixture: ComponentFixture<NewworkoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewworkoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewworkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
