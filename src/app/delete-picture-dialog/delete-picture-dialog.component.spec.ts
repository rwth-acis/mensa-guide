import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeletePictureDialogComponent} from './delete-picture-dialog.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatSnackBarModule} from '@angular/material';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('DeletePictureDialogComponent', () => {
  let component: DeletePictureDialogComponent;
  let fixture: ComponentFixture<DeletePictureDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeletePictureDialogComponent],
      imports: [MatDialogModule, LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG}), MatSnackBarModule, HttpClientTestingModule],
      providers: [{
        provide: MAT_DIALOG_DATA,
        useValue: {
          dish: 'some dish',
          picture: 'some picture data',
        }
      }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePictureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
