import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import 'hammerjs';
import {DishCarouselComponent} from './dish-carousel.component';
import {NgxHmCarouselModule} from 'ngx-hm-carousel';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatCardModule, MatDialogModule} from '@angular/material';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('DishCarouselComponent', () => {
  let component: DishCarouselComponent;
  let fixture: ComponentFixture<DishCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DishCarouselComponent],
      imports: [NgxHmCarouselModule, FormsModule, MatButtonModule,
        LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG}),
        MatDialogModule, HttpClientTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
