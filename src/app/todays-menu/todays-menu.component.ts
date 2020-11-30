import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  MensaMenus,
  MenuPictures,
  MenuRatings,
  StoreService,
} from "../store.service";

@Component({
  selector: "app-todays-menu",
  templateUrl: "./todays-menu.component.html",
  styleUrls: ["./todays-menu.component.scss"],
})
export class TodaysMenuComponent implements OnInit, OnDestroy {
  menu: MensaMenus;
  reviews: MenuRatings;
  pictures: MenuPictures;
  selectedMensa: string;
  mensas: { name: string; id: string }[];
  compactMode = false;
  filter = "";

  constructor(private store: StoreService) {}

  onMensaChanged(mensa: string) {
    this.store.setSelectedMensa(mensa);
    setTimeout((_) => (this.selectedMensa = mensa));
  }

  onCompactToggled() {
    this.store.setCompactMode(!this.compactMode);
  }

  ngOnInit() {
    this.store.selectedMensa.subscribe(
      (selectedMensa) => (this.selectedMensa = selectedMensa)
    );
    this.store.compactMode.subscribe(
      (compactMode) => (this.compactMode = compactMode)
    );
    this.store.startPolling();
    this.store.menu.subscribe((menu) => {
      this.menu = menu;
      console.log(menu);
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
    this.store.stopPolling();
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
