import { Component, Input, OnInit } from "@angular/core";
import { Dish } from "../models/menu";
import { Rating, ReviewForm } from "../models/rating";

import { StoreService } from "../store.service";

@Component({
  selector: "app-review-form",
  templateUrl: "./review-form.component.html",
  styleUrls: ["./review-form.component.scss"],
})
export class ReviewFormComponent implements OnInit {
  @Input() review: ReviewForm = {
    author: null,
    comment: "",
    mensaId: null,
    stars: 5,
    id: null,
  };
  @Input() dish: Dish;
  mensas: { name: string; id: number }[];

  constructor(private store: StoreService) {
    this.mensas = this.store.mensas;
  }

  ngOnInit() {}

  save() {
    if (this.review.id) this.store.updateReview(this.review).subscribe();
    else this.store.addReview(this.dish.id, this.review).subscribe();
  }
}
