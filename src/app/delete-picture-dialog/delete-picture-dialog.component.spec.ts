import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePictureDialogComponent } from './delete-picture-dialog.component';

describe('DeletePictureDialogComponent', () => {
  let component: DeletePictureDialogComponent;
  let fixture: ComponentFixture<DeletePictureDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletePictureDialogComponent ]
    })
    .compileComponents();
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
