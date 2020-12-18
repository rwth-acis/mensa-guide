import { Component, Input, OnInit } from "@angular/core";
import { Dish } from "../models/menu";
import { Rating } from "../models/rating";

import { StoreService } from "../store.service";

@Component({
  selector: "app-review-form",
  templateUrl: "./review-form.component.html",
  styleUrls: ["./review-form.component.scss"],
})
export class ReviewFormComponent implements OnInit {
  @Input() review: Rating = {
    author: null,
    comment: "",
    timestamp: null,
    mensa: null,
    stars: 5,
  };
  @Input() dish: Dish;
  mensas: { name: string; id: string }[];

  constructor(private store: StoreService) {
    this.mensas = this.store.mensas;
  }

  ngOnInit() {}

  save() {
    this.store.addReview(this.dish.id, this.review);
  }
}
