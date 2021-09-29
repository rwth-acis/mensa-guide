import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Picture } from '../models/picture';
import { StoreService } from '../store.service';

export interface DeletePictureDialogData {
  dish: string;
  picture: Picture;
}

@Component({
  selector: 'app-delete-picture-dialog',
  templateUrl: './delete-picture-dialog.component.html',
  styleUrls: ['./delete-picture-dialog.component.scss'],
})
export class DeletePictureDialogComponent implements OnInit {
  constructor(
    private store: StoreService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DeletePictureDialogData
  ) {}

  ngOnInit() {}

  onYesClick() {
    this.store
      .deletePicture(this.data.dish, this.data.picture)
      .subscribe(() => {
        this.snackBar.open('Your picture has been deleted.', null, {
          duration: 3000,
        });
      });
  }
}
