import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
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
import { Subscription } from "rxjs";

@Component({
  selector: "app-dish-card",
  templateUrl: "./dish-card.component.html",
  styleUrls: ["./dish-card.component.scss"],
})
export class DishCardComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() dish: Dish;
  @Input() category: string;
  @Input() compact = false;
  isExpanded = false;
  carouselData: Picture[] = [
    { image: "assets/placeholders/dish-placeholder.png", author: "" },
  ];
  averageStars: number;
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
  currDishId: number;

  private subs: Subscription[] = [];

  constructor(
    private store: StoreService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    let sub = this.store.user.subscribe((user) => {
      if (user) {
        this.uploadButtonOpts.disabled = false;
        this.uploadButtonOpts.text = "UPLOAD PHOTO";
      } else {
        this.uploadButtonOpts.disabled = true;
        this.uploadButtonOpts.text = "LOGIN TO UPLOAD";
      }
    });
    this.subs.push(sub);

    sub = this.store.dishData.subscribe(([currDish, pictures, ratings]) => {
      if (currDish && this.dish.id == currDish.id) {
        //init data for card content if dish is selected
        if (ratings && pictures) {
          this.numReviews = ratings.length;
          if (ratings.length > 0) {
            this.averageStars =
              ratings
                .map((rating) => rating.stars)
                .reduce((sum, curr) => sum + curr) / this.numReviews;
            console.log(this.averageStars);
          } else {
            this.averageStars = 0;
          }

          if (pictures.length > 0) {
            this.carouselData = DishCardComponent.shuffle(pictures);
            this.carouselPlaceholder = false;
          } else {
            this.carouselPlaceholder = true;
          }
          this.initialized = true;
        } else {
          this.initialized = false;
        }
      }
    });
    this.subs.push(sub);
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
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

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (this.initialized) {
  //     if (changes.pictureCollection) {
  //       const pictures: Picture[] = changes.pictureCollection.currentValue;
  //       DishCardComponent.extractImagesFromPictureCollection(pictures).then(
  //         (imageData) => {
  //           if (imageData) {
  //             this.initialized = true;
  //           }

  //           if (imageData.length === 0) {
  //             imageData = [
  //               {
  //                 image: "assets/placeholders/dish-placeholder.png",
  //                 author: "",
  //               },
  //             ];
  //             this.carouselPlaceholder = true;
  //           } else {
  //             this.carouselPlaceholder = false;
  //           }
  //           this.carouselData = imageData;
  //         }
  //       );
  //     }
  //   }
  // }

  openReviewDialog(): void {
    this.dialog.open(ReviewsComponent, {
      width: "80%",
      data: { dish: this.dish },
    });
  }

  // isExpanded() {
  //   return !this.compact || this.expanded;
  // }

  toggleExpanded() {
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
