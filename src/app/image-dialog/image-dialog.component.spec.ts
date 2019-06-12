import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ImageDialogComponent} from './image-dialog.component';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material';
import {PinchZoomModule} from 'ngx-pinch-zoom';

describe('ImageDialogComponent', () => {
  let component: ImageDialogComponent;
  let fixture: ComponentFixture<ImageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImageDialogComponent],
      imports: [MatDialogModule, PinchZoomModule],
      providers: [{
        provide: MAT_DIALOG_DATA,
        useValue: {
          picture: 'some picture data',
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
