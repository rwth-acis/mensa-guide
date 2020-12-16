import { Component, OnDestroy, OnInit } from "@angular/core";
import { Dish } from "../models/menu";
import {
  MensaMenus,
  MenuPictures,
  MenuRatings,
  StoreService,
} from "../store.service";

@Component({
  selector: "app-dishes",
  templateUrl: "./dishes.component.html",
  styleUrls: ["./dishes.component.scss"],
})
export class DishesComponent implements OnInit, OnDestroy {
  dishes: Dish[];
  menu: MensaMenus;
  reviews: MenuRatings;
  pictures: MenuPictures;
  compactMode = false;
  filter = "";

  constructor(private store: StoreService) {}

  ngOnInit() {
    this.store.startPolling(false);
    this.store.dishes.subscribe((dishes) => {
      this.dishes = dishes;
      console.log(dishes);
    });
    this.store.menu.subscribe((menu) => (this.menu = menu));
    this.store.menuRatings.subscribe((reviews) => (this.reviews = reviews));
    this.store.menuPictures.subscribe((pictures) => (this.pictures = pictures));
    this.store.compactMode.subscribe(
      (compactMode) => (this.compactMode = compactMode)
    );
  }

  ngOnDestroy(): void {
    this.store.stopPolling();
  }

  onCompactToggled() {
    this.store.setCompactMode(!this.compactMode);
  }

  isFiltered(name: string) {
    if (this.filter) {
      if (!name) {
        return false;
      }
      let filterArr = this.filter.split(/(\s+)/);
      filterArr = filterArr.filter(
        (element) => element !== "" && element !== " "
      );
      return !filterArr.some((element) => {
        const nameLowerCase = name.toLowerCase();
        const elementLowerCase = element.toLowerCase();
        return nameLowerCase.includes(elementLowerCase);
      });
    }
    return false;
  }
}
