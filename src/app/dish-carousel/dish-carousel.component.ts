import { Component, Input, OnInit } from "@angular/core";

import { StoreService } from "../store.service";
import { MatDialog } from "@angular/material";
import { DeletePictureDialogComponent } from "../delete-picture-dialog/delete-picture-dialog.component";
import { ImageDialogComponent } from "../image-dialog/image-dialog.component";
import { Picture } from "../models/picture";

@Component({
  selector: "app-dish-carousel",
  templateUrl: "./dish-carousel.component.html",
  styleUrls: ["./dish-carousel.component.scss"],
})
export class DishCarouselComponent implements OnInit {
  currentIndex = 0;
  infinite = true;
  user = null;

  @Input() dish: string;
  @Input() pictures: Picture[] = [];
  @Input() fitPicture = false;
  @Input() placeholder = false;

  constructor(private store: StoreService, private dialog: MatDialog) {}

  ngOnInit() {
    this.store.user.subscribe((user) => (this.user = user));
  }

  openDeletePictureDialog(event: Event, picture: Picture) {
    event.stopPropagation();
    this.dialog.open(DeletePictureDialogComponent, {
      data: { dish: this.dish, picture },
    });
  }

  onPictureClicked(picture: Picture) {
    if (!this.placeholder) {
      this.openShowPictureDialog(picture);
    }
  }

  openShowPictureDialog(picture: Picture) {
    this.dialog.open(ImageDialogComponent, {
      maxWidth: "90vw",
      width: "90vw",
      data: { image: picture.image },
    });
  }
}
