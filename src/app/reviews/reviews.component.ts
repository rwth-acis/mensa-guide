import { Component, Inject, OnInit, ViewChild } from "@angular/core";

import { StoreService } from "../store.service";
import { MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { ReviewFormComponent } from "../review-form/review-form.component";
import * as moment from "moment";
import { Rating } from "../models/rating";
import { Dish } from "../models/menu";

export interface ReviewsDialogData {
  dish: Dish;
}

@Component({
  selector: "app-reviews",
  templateUrl: "./reviews.component.html",
  styleUrls: ["./reviews.component.scss"],
})
export class ReviewsComponent implements OnInit {
  @ViewChild("reviewForm", { static: false })
  reviewForm: ReviewFormComponent;
  reviews: Rating[];
  sortedReviews: Rating[] = [];
  min = Math.min;
  user: { profile: { preferred_username: string } };
  /**
   * Used for prettifying mensa IDs to their names.
   */
  mensas: object = {};
  editMode = false;

  constructor(
    private store: StoreService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: ReviewsDialogData
  ) {}

  private static sortReviews(reviews: Rating[]): void {
    reviews.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
  }

  ngOnInit() {
    this.store.menuRatings.subscribe();
    this.store.user.subscribe((user) => (this.user = user));
  }

  formatDate(dateString: string): string {
    const momentDate = moment(dateString);
    return momentDate.calendar();
  }

  deleteReview() {
    this.store.deleteReview(this.data.dish.id).then(() =>
      this.snackBar.open("Your review has been deleted.", null, {
        duration: 3000,
      })
    );
  }
}
