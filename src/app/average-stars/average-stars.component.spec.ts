import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AverageStarsComponent} from './average-stars.component';
import {MatIconModule} from '@angular/material';

describe('AverageStarsComponent', () => {
  let component: AverageStarsComponent;
  let fixture: ComponentFixture<AverageStarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AverageStarsComponent],
      imports: [
        MatIconModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AverageStarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
