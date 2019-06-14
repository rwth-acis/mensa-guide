import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ApiService, Menu, Picture, PictureCollection, Rating, RatingCollection} from './api.service';
import {ConnectionService} from './connection.service';
import {distinctUntilChanged, throttleTime} from 'rxjs/operators';
import {isEqual} from 'lodash';

export interface MensaMenus {
  vita: Menu;
  academica: Menu;
  ahornstrasse: Menu;
  templergraben: Menu;
}


export interface MenuRatings {
  // menu item name
  [key: string]: RatingCollection;
}

export interface MenuPictures {
  // menu item name
  [key: string]: PictureCollection;
}

export interface State {
  dishes: string[];
  menus: MensaMenus;
  ratings: MenuRatings;
  pictures: MenuPictures;
  user: object;
  selectedMensa: string;
  compactMode: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  public readonly mensas = [{name: 'Academica', id: 'academica'}, {name: 'Ahornstraße', id: 'ahornstrasse'},
    {name: 'Templergraben', id: 'templergraben'}, {name: 'Vita', id: 'vita'}];
  private dishesSubject = new BehaviorSubject<string[]>([]);
  public dishes = this.dishesSubject.asObservable()
    .pipe(distinctUntilChanged((prev, curr) => isEqual(prev, curr))).pipe(throttleTime(1000));
  private menuSubject = new BehaviorSubject<MensaMenus>({
    vita: {extras: {}, menus: {}},
    academica: {extras: {}, menus: {}},
    ahornstrasse: {extras: {}, menus: {}},
    templergraben: {extras: {}, menus: {}}
  });
  public menu = this.menuSubject.asObservable()
    .pipe(distinctUntilChanged((prev, curr) => isEqual(prev, curr))).pipe(throttleTime(1000));
  private menuRatingsSubject = new BehaviorSubject<MenuRatings>({});
  public menuRatings = this.menuRatingsSubject.asObservable()
    .pipe(distinctUntilChanged((prev, curr) => isEqual(prev, curr))).pipe(throttleTime(1000));
  private menuPicturesSubject = new BehaviorSubject<MenuPictures>({});
  public menuPictures = this.menuPicturesSubject.asObservable()
    .pipe(distinctUntilChanged((prev, curr) => isEqual(prev, curr))).pipe(throttleTime(1000));
  private onlineSubject = new BehaviorSubject<boolean>(true);
  public online = this.onlineSubject.asObservable();
  private intervalHandle;
  private userSubject = new BehaviorSubject(null);
  public user = this.userSubject.asObservable();
  private selectedMensaSubject = new BehaviorSubject<string>(null);
  public selectedMensa = this.selectedMensaSubject.asObservable();
  private compactModeSubject = new BehaviorSubject<boolean>(false);
  public compactMode = this.compactModeSubject.asObservable();

  constructor(private api: ApiService, private connection: ConnectionService) {
    this.loadStateFromLocalStorage();
    connection.monitor().subscribe(online => this.onlineSubject.next(online));
    const saveFunc = () => this.saveStateToLocalStorage();
    this.menu.subscribe(saveFunc);
    this.menuRatings.subscribe(saveFunc);
    this.menuPictures.subscribe(saveFunc);
    this.user.pipe(distinctUntilChanged()).subscribe((user) => {
      if (user) {
        this.api.setCredentials(user.profile.preferred_username, user.profile.sub, user.access_token);
      } else {
        this.api.resetCredentials();
      }
      saveFunc();
    });
    this.selectedMensaSubject.subscribe(saveFunc);
    this.compactModeSubject.subscribe(saveFunc);
  }

  public startPolling(todaysMenuOnly = true) {
    if (this.intervalHandle == null) {
      this.refreshState(todaysMenuOnly);
      this.intervalHandle = setInterval(() => this.refreshState(todaysMenuOnly), 60000);
    }
  }

  public stopPolling() {
    clearInterval(this.intervalHandle);
    this.intervalHandle = null;
  }

  setUser(user) {
    this.userSubject.next(user);
    this.saveStateToLocalStorage();
  }

  setSelectedMensa(mensa: string) {
    this.selectedMensaSubject.next(mensa);
  }

  setCompactMode(compact: boolean) {
    this.compactModeSubject.next(compact);
  }

  async addPicture(dish: string, picture: Picture) {
    return new Promise(resolve => {
      this.api.addPicture(dish, picture).then((updatedPictures) => {
        const pictures = this.menuPicturesSubject.getValue();
        pictures[dish] = updatedPictures;
        this.menuPicturesSubject.next(pictures);
        resolve();
      });
    });
  }

  async deletePicture(dish: string, picture: Picture) {
    return new Promise(resolve => {
      this.api.deletePicture(dish, picture).then((updatedPictures) => {
        const pictures = this.menuPicturesSubject.getValue();
        pictures[dish] = updatedPictures;
        this.menuPicturesSubject.next(pictures);
        resolve();
      });
    });
  }

  async addReview(dish: string, review: Rating) {
    return new Promise(resolve => {
      this.api.addRating(dish, review).then((updatedRatings) => {
        const reviews = this.menuRatingsSubject.getValue();
        reviews[dish] = updatedRatings;
        this.menuRatingsSubject.next(reviews);
        resolve();
      });
    });
  }

  async deleteReview(dish: string) {
    return new Promise(resolve => {
      this.api.deleteRating(dish).then((updatedRatings) => {
        const reviews = this.menuRatingsSubject.getValue();
        reviews[dish] = updatedRatings;
        this.menuRatingsSubject.next(reviews);
        resolve();
      });
    });
  }

  private refreshState(todaysMenuOnly = true) {
    if (this.onlineSubject.getValue()) {
      // keep track for what dishes we already fetched pictures and ratings
      const processedDishes = new Set();
      this.api.fetchDishes().then(dishes => {
        this.dishesSubject.next(dishes);
        if (!todaysMenuOnly) {
          for (const menuItem of dishes) {
            if (!processedDishes.has(menuItem)) {
              this.fetchReviewsAndPicturesForDish(menuItem);
              processedDishes.add(menuItem);
            }
          }
        }
      });
      for (const mensa of this.mensas.map(mensaInfo => mensaInfo.id)) {
        this.api.fetchMenu(mensa).then(menu => {
          const mensaMenu = this.menuSubject.getValue();
          mensaMenu[mensa] = menu;
          this.menuSubject.next(mensaMenu);
          for (const menuItem of Object.values(menu.menus)) {
            if (!processedDishes.has(menuItem)) {
              this.fetchReviewsAndPicturesForDish(menuItem);
              processedDishes.add(menuItem);
            }
          }
        });
      }
    }
  }

  private fetchReviewsAndPicturesForDish(menuItem) {
    this.api.fetchRatings(menuItem).then(ratings => {
      const menuRatings = this.menuRatingsSubject.getValue();
      menuRatings[menuItem] = ratings;
      this.menuRatingsSubject.next(menuRatings);
    });
    this.api.fetchPictures(menuItem).then(pictures => {
      const mensaPictures = this.menuPicturesSubject.getValue();
      mensaPictures[menuItem] = pictures;
      this.menuPicturesSubject.next(mensaPictures);
    });
  }

  private saveStateToLocalStorage() {
    const state: State = {
      dishes: this.dishesSubject.getValue(),
      menus: this.menuSubject.getValue(),
      ratings: this.menuRatingsSubject.getValue(),
      pictures: this.menuPicturesSubject.getValue(),
      user: this.userSubject.getValue(),
      selectedMensa: this.selectedMensaSubject.getValue(),
      compactMode: this.compactModeSubject.getValue(),
    };
    localStorage.setItem('mensa-state', JSON.stringify(state));
  }

  private loadStateFromLocalStorage() {
    const stateString = localStorage.getItem('mensa-state');
    if (stateString) {
      const state: State = JSON.parse(stateString);
      if (state.dishes != null) {
        this.dishesSubject.next(state.dishes);
      }
      if (state.menus != null) {
        this.menuSubject.next(state.menus);
      }
      if (state.ratings != null) {
        this.menuRatingsSubject.next(state.ratings);
      }
      if (state.pictures != null) {
        this.menuPicturesSubject.next(state.pictures);
      }
      if (state.user != null) {
        this.userSubject.next(state.user);
      }
      if (state.selectedMensa != null) {
        this.selectedMensaSubject.next(state.selectedMensa);
      }
      if (state.compactMode != null) {
        this.compactModeSubject.next(state.compactMode);
      }
    }
  }
}
