import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReviewsComponent} from './reviews.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatIconModule, MatInputModule, MatSelectModule, MatSnackBarModule} from '@angular/material';
import {ReviewFormComponent} from '../review-form/review-form.component';
import {FormsModule} from '@angular/forms';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ReviewsComponent', () => {
  let component: ReviewsComponent;
  let fixture: ComponentFixture<ReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewsComponent, ReviewFormComponent],
      imports: [MatIconModule, FormsModule, MatInputModule, MatSelectModule, LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG}),
        MatSnackBarModule, MatDialogModule, HttpClientTestingModule],
      providers: [{
        provide: MAT_DIALOG_DATA,
        useValue: {
          dish: 'some dish',
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
