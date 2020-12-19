import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MensaMenus, menuItem } from "../models/menu";
import { Picture } from "../models/picture";
import { Rating } from "../models/rating";
import { StoreService } from "../store.service";

@Component({
  selector: "app-todays-menu",
  templateUrl: "./todays-menu.component.html",
  styleUrls: ["./todays-menu.component.scss"],
})
export class TodaysMenuComponent implements OnInit, OnDestroy {
  menu: menuItem[];
  menu$: Observable<menuItem[]>; //menu which should be displayed
  reviews: Rating[];
  pictures: Picture[];
  selectedMensa: string;
  mensas: { name: string; id: number }[];
  compactMode = true;
  filter = "";

  constructor(private store: StoreService) {}

  onMensaChanged(mensa: string) {
    this.store.setSelectedMensa(mensa);
    setTimeout((_) => (this.selectedMensa = mensa));
  }

  onCompactToggled() {
    //  this.store.setCompactMode(!this.compactMode);
  }

  ngOnInit() {
    this.store.selectedMensa.subscribe(
      (selectedMensa) => (this.selectedMensa = selectedMensa)
    );

    // this.store.compactMode.subscribe(
    //   (compactMode) => (this.compactMode = compactMode)
    // );
    // this.store.startPolling();
    this.menu$ = this.store.menu;
    this.menu$.subscribe((menu) => {
      this.menu = menu;
    });
    this.store.menuRatings.subscribe((reviews) => (this.reviews = reviews));
    this.store.menuPictures.subscribe((pictures) => (this.pictures = pictures));
    this.mensas = this.store.mensas;
  }

  isWeekend(): boolean {
    const today = new Date();
    return today.getDay() === 6 || today.getDay() === 0;
  }

  ngOnDestroy(): void {
    //this.store.stopPolling();
  }

  isFiltered(name: string) {
    if (!this.filter || !name) return false;
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
}
