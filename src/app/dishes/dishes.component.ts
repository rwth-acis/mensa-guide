import {Component, OnDestroy, OnInit} from '@angular/core';
import {MensaMenus, MenuPictures, MenuRatings, StoreService} from '../store.service';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.scss']
})
export class DishesComponent implements OnInit, OnDestroy {
  dishes: string[];
  menu: MensaMenus;
  reviews: MenuRatings;
  pictures: MenuPictures;

  constructor(private store: StoreService) {
  }

  ngOnInit() {
    this.store.startPolling(false);
    this.store.dishes.subscribe(dishes => this.dishes = dishes);
    this.store.menu.subscribe(menu => this.menu = menu);
    this.store.menuRatings.subscribe(reviews => this.reviews = reviews);
    this.store.menuPictures.subscribe(pictures => this.pictures = pictures);
  }

  ngOnDestroy(): void {
    this.store.stopPolling();
  }
}
