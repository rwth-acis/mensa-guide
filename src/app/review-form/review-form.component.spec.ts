import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReviewFormComponent} from './review-form.component';
import {FormsModule} from '@angular/forms';
import {MatInputModule, MatSelectModule} from '@angular/material';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ReviewFormComponent', () => {
  let component: ReviewFormComponent;
  let fixture: ComponentFixture<ReviewFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewFormComponent],
      imports: [FormsModule, MatSelectModule, LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG}), MatInputModule,
        BrowserAnimationsModule, HttpClientTestingModule, HttpClientTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
