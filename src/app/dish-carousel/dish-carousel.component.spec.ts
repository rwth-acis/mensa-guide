import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DishCarouselComponent } from './dish-carousel.component';

describe('DishCarouselComponent', () => {
  let component: DishCarouselComponent;
  let fixture: ComponentFixture<DishCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DishCarouselComponent ]
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
