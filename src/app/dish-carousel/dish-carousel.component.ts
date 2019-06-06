import {Component, Input, OnInit} from '@angular/core';
import {Picture} from '../api.service';
import {StoreService} from '../store.service';
import {MatDialog} from '@angular/material';
import {DeletePictureDialogComponent} from '../delete-picture-dialog/delete-picture-dialog.component';

@Component({
  selector: 'app-dish-carousel',
  templateUrl: './dish-carousel.component.html',
  styleUrls: ['./dish-carousel.component.scss']
})
export class DishCarouselComponent implements OnInit {
  currentIndex = 0;
  infinite = true;
  user = null;

  @Input() dish: string;
  @Input() pictures: Picture[] = [];
  @Input() fitPicture = false;

  constructor(private store: StoreService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.store.user.subscribe(user => this.user = user);
  }

  openDeletePictureDialog(picture: Picture) {
    this.dialog.open(DeletePictureDialogComponent, {
      data: {dish: this.dish, picture}
    });
  }
}
