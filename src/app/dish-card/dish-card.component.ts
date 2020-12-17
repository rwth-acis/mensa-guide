import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { StoreService } from "../store.service";
import * as Compress from "compress.js";
import { MatProgressButtonOptions } from "mat-progress-buttons";
import { MatDialog, MatSnackBar } from "@angular/material";

import { ReviewsComponent } from "../reviews/reviews.component";
import { meanBy } from "lodash";
import { Dish } from "../models/menu";
import { Rating } from "../models/rating";
import { Picture } from "../models/picture";

@Component({
  selector: "app-dish-card",
  templateUrl: "./dish-card.component.html",
  styleUrls: ["./dish-card.component.scss"],
})
export class DishCardComponent implements OnChanges, AfterViewInit {
  @Input() dish: Dish;
  @Input() category: string;
  @Input() compact = false;
  isExpanded = false;
  carouselData: Picture[] = [
    { image: "assets/placeholders/dish-placeholder.png", author: "" },
  ];
  averageStars: number = null;
  @ViewChild("photoUpload", { static: false })
  photoFileInput: ElementRef;
  uploadButtonOpts: MatProgressButtonOptions = {
    active: false,
    text: "UPLOAD PHOTO",
    spinnerSize: 19,
    raised: false,
    stroked: false,
    flat: false,
    fab: false,
    buttonColor: "primary",
    spinnerColor: "primary",
    fullWidth: false,
    disabled: false,
    mode: "indeterminate",
  };
  carouselPlaceholder = false;
  initialized = false;
  user;
  numReviews: number;

  constructor(
    private store: StoreService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.store.user.subscribe((user) => {
      if (user) {
        this.uploadButtonOpts.disabled = false;
        this.uploadButtonOpts.text = "UPLOAD PHOTO";
      } else {
        this.uploadButtonOpts.disabled = true;
        this.uploadButtonOpts.text = "LOGIN TO UPLOAD";
      }
    });
    this.store.selectedDish.subscribe((dish) => {
      if (!this.dish || this.dish.id !== dish.id) {
        this.isExpanded = false; //close the card if user opened another one
      }
    });
  }

  private static async extractImagesFromPictureCollection(
    pictures: Picture[]
  ): Promise<Picture[]> {
    if (pictures == null) {
      pictures = [];
    }
    const imageData = [];
    for (const picture of pictures) {
      imageData.push(picture);
    }
    this.shuffle(imageData);
    return imageData;
  }

  private static shuffle(arr: any[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  triggerPhotoUpload() {
    this.photoFileInput.nativeElement.click();
    const e = new Event("touchstart");
    this.photoFileInput.nativeElement.dispatchEvent(e);
  }

  ngAfterViewInit(): void {
    this.store.user.subscribe((user) => (this.user = user));
    if (this.photoFileInput) {
      this.photoFileInput.nativeElement.addEventListener("change", (e) =>
        this.uploadPhoto(e.target.files)
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized) {
      if (changes.pictureCollection) {
        const pictures: Picture[] = changes.pictureCollection.currentValue;
        DishCardComponent.extractImagesFromPictureCollection(pictures).then(
          (imageData) => {
            if (imageData.length === 0) {
              imageData = [
                {
                  image: "assets/placeholders/dish-placeholder.png",
                  author: "",
                },
              ];
              this.carouselPlaceholder = true;
            } else {
              this.carouselPlaceholder = false;
            }
            this.carouselData = imageData;
          }
        );
      }
    }
  }

  openReviewDialog(): void {
    this.dialog.open(ReviewsComponent, {
      width: "80%",
      data: { dish: this.dish.name },
    });
  }

  // isExpanded() {
  //   return !this.compact || this.expanded;
  // }

  toggleExpanded() {
    console.log("toggle");

    this.isExpanded = !this.isExpanded;
    if (this.isExpanded === true) {
      this.store.setSelectedDish(this.dish);
    }
  }

  onCarouselClicked() {
    if (
      this.user &&
      this.carouselPlaceholder &&
      this.photoFileInput.nativeElement
    ) {
      this.photoFileInput.nativeElement.click();
    }
  }

  // private calculateAverageStars() {
  //   if (!this.reviewCollection) return;
  //   const reviews = Object.values(this.reviewCollection);
  //   if (!reviews || reviews.length === 0) {
  //     this.averageStars = null;
  //     return;
  //   }
  //   this.averageStars = Math.round(meanBy(reviews, (review) => review.stars));
  //   this.numReviews = reviews.length;
  // }

  private uploadPhoto(fileList: FileList) {
    this.uploadButtonOpts.active = true;
    const files = Array.from(fileList);
    const compress = new Compress();
    this.snackBar.open("Compressing...");
    compress
      .compress(files, {
        size: 1, // the max size in MB, defaults to 2MB
        resize: true, // defaults to true, set false if you do not want to resize the image width and height
      })
      .then((compressedFiles) => {
        this.snackBar.open("Uploading...");
        for (const compressionData of compressedFiles) {
          const base64str = compressionData.data;
          const imgExt = compressionData.ext;
          const file = Compress.convertBase64ToFile(base64str, imgExt);
          const reader = new FileReader();
          reader.addEventListener(
            "load",
            () => {
              const image = reader.result.toString();
              this.store
                .addPicture(this.dish.id, { image, author: null })
                .then(() => {
                  this.uploadButtonOpts.active = false;
                  this.snackBar.open(
                    "Done! Your photo is now available in the gallery.",
                    null,
                    {
                      duration: 3000,
                    }
                  );
                });
            },
            false
          );
          reader.readAsDataURL(file);
        }
      });
  }
}
