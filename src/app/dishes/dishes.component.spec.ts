import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DishesComponent} from './dishes.component';
import {MatCardModule, MatIconModule, MatProgressSpinnerModule} from '@angular/material';
import {DishCardComponent} from '../dish-card/dish-card.component';
import {DishCarouselComponent} from '../dish-carousel/dish-carousel.component';
import {MatProgressButtonsModule} from 'mat-progress-buttons';
import {FormsModule} from '@angular/forms';
import {NgxHmCarouselModule} from 'ngx-hm-carousel';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('DishesComponent', () => {
  let component: DishesComponent;
  let fixture: ComponentFixture<DishesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DishesComponent, DishCardComponent, DishCarouselComponent],
      imports: [MatCardModule, MatIconModule, MatProgressSpinnerModule, MatProgressButtonsModule.forRoot(), FormsModule,
        NgxHmCarouselModule, LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG}), HttpClientTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
