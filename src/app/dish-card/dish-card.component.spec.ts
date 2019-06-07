import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DishCardComponent} from './dish-card.component';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatSnackBarModule
} from '@angular/material';
import {DishCarouselComponent} from '../dish-carousel/dish-carousel.component';
import {MatProgressButtonsModule} from 'mat-progress-buttons';
import {NgxHmCarouselModule} from 'ngx-hm-carousel';
import {FormsModule} from '@angular/forms';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('DishCardComponent', () => {
  let component: DishCardComponent;
  let fixture: ComponentFixture<DishCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DishCardComponent, DishCarouselComponent],
      imports: [MatDialogModule, MatSnackBarModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule,
        MatProgressButtonsModule.forRoot(), FormsModule, NgxHmCarouselModule, LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG}),
        HttpClientTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
