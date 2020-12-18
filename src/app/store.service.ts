import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest } from "rxjs";
import { ApiService } from "./api.service";
import { ConnectionService } from "./connection.service";
import { combineAll, distinctUntilChanged, throttleTime } from "rxjs/operators";
import { isEqual } from "lodash";
import { Dish, MensaMenus, menuItem } from "./models/menu";
import { Rating } from "./models/rating";
import { Picture } from "./models/picture";

export interface State {
  dishes: Dish[];
  menus: MensaMenus;
  ratings: Rating[];
  pictures: Picture[];
  user: object;
  selectedMensa: string;
  compactMode: boolean;
}

@Injectable({
  providedIn: "root",
})
export class StoreService {
  public readonly mensas = [
    { name: "Academica", id: "academica" },
    { name: "Ahornstraße", id: "ahornstrasse" },
    { name: "Vita", id: "vita" },
  ];
  //private intervalHandle: NodeJS.Timer;

  //Subjects
  private selectedMensa$ = new BehaviorSubject<string>(null);
  private user$ = new BehaviorSubject(null);
  private dishes$ = new BehaviorSubject<Dish[]>([]);
  private menu$ = new BehaviorSubject<MensaMenus>({
    vita: [],
    academica: [],
    ahornstrasse: [],
  });
  private menuRatings$ = new BehaviorSubject<Rating[]>(null);
  private menuPictures$ = new BehaviorSubject<Picture[]>(null);
  private online$ = new BehaviorSubject<boolean>(true);
  private compactMode$ = new BehaviorSubject<boolean>(false);
  private selectedDish$ = new BehaviorSubject<Dish>(null);

  constructor(private api: ApiService, private connection: ConnectionService) {
    this.loadStateFromLocalStorage();
    this.connection.monitor().subscribe((online) => this.online$.next(online));

    this.initLocalStorageSave();
  }

  //Getters for Observables
  public get dishes() {
    return this.dishes$
      .asObservable()
      .pipe(distinctUntilChanged((prev, curr) => isEqual(prev, curr)))
      .pipe(throttleTime(1000));
  }

  public get menu() {
    return this.menu$
      .asObservable()
      .pipe(distinctUntilChanged((prev, curr) => isEqual(prev, curr)))
      .pipe(throttleTime(1000));
  }

  public get menuRatings() {
    return this.menuRatings$
      .asObservable()
      .pipe(distinctUntilChanged((prev, curr) => isEqual(prev, curr)))
      .pipe(throttleTime(1000));
  }

  public get menuPictures() {
    return this.menuPictures$
      .asObservable()
      .pipe(distinctUntilChanged((prev, curr) => isEqual(prev, curr)))
      .pipe(throttleTime(1000));
  }

  public get dishData() {
    return combineLatest(
      this.selectedDish,
      this.menuPictures,
      this.menuRatings
    );
  }
  public get online() {
    return this.online$.asObservable();
  }

  public get user() {
    return this.user$.asObservable();
  }

  public get selectedMensa() {
    return this.selectedMensa$.asObservable();
  }

  public get selectedDish() {
    return this.selectedDish$.asObservable();
  }
  //Setters
  setUser(user) {
    this.user$.next(user);
    this.saveStateToLocalStorage();
  }

  setSelectedMensa(mensa) {
    this.selectedMensa$.next(mensa);
    this.api.fetchMenu(mensa).then((menu) => {
      const mensaMenu = this.menu$.getValue();
      mensaMenu[mensa] = menu;
      this.menu$.next(mensaMenu);
    });
  }

  setSelectedDish(dish: Dish) {
    this.selectedDish$.next(dish);
    this.fetchReviewsAndPicturesForDish(dish.id);
  }

  // public startPolling(todaysMenuOnly = true) {
  //   if (this.intervalHandle == null) {
  //     this.refreshState(todaysMenuOnly);
  //     this.intervalHandle = setInterval(
  //       () => this.refreshState(todaysMenuOnly),
  //       360000 //6minutes
  //     );
  //   }
  // }

  // public stopPolling() {
  //   clearInterval(this.intervalHandle);
  //   this.intervalHandle = null;
  // }

  initDishes() {
    this.api.fetchDishes().then((dishes) => {
      this.dishes$.next(dishes);
    });
  }

  async addPicture(dishId: number, picture: Picture) {
    return new Promise((resolve) => {
      this.api.addPicture(dishId, picture).then((updatedPictures) => {
        const pictures = this.menuPictures$.getValue();
        pictures[dishId] = updatedPictures;
        this.menuPictures$.next(pictures);
        Promise.resolve();
      });
    });
  }

  async deletePicture(dish: string, picture: Picture) {
    return new Promise((resolve) => {
      this.api.deletePicture(dish, picture).then((updatedPictures) => {
        const pictures = this.menuPictures$.getValue();
        pictures[dish] = updatedPictures;
        this.menuPictures$.next(pictures);
        Promise.resolve();
      });
    });
  }

  async addReview(dishId: number, review: Rating) {
    return new Promise((resolve) => {
      this.api.addRating(dishId, review).then((updatedRatings) => {
        const reviews = this.menuRatings$.getValue();
        reviews[dishId] = updatedRatings;
        this.menuRatings$.next(reviews);
        Promise.resolve();
      });
    });
  }

  async deleteReview(dishId: number) {
    return new Promise((resolve) => {
      this.api.deleteRating(dishId).then((updatedRatings) => {
        const reviews = this.menuRatings$.getValue();
        //reviews[dishId] = updatedRatings;
        this.menuRatings$.next(reviews);
        Promise.resolve();
      });
    });
  }

  // private refreshState(todaysMenuOnly = true) {
  //   if (this.online$.getValue()) {
  //     // keep track for what dishes we already fetched pictures and ratings
  //     const processedDishes = new Set();
  //     this.api.fetchDishes().then((dishes) => {
  //       this.dishes$.next(dishes);
  //       if (!todaysMenuOnly) {
  //         for (const menuItem of dishes) {
  //           if (!processedDishes.has(menuItem)) {
  //             this.fetchReviewsAndPicturesForDish(menuItem.id);
  //             processedDishes.add(menuItem);
  //           }
  //         }
  //       }
  //     });
  //     for (const mensa of this.mensas.map((mensaInfo) => mensaInfo.id)) {
  //       this.api.fetchMenu(mensa).then((menu) => {
  //         const mensaMenu = this.menu$.getValue();
  //         mensaMenu[mensa] = menu;
  //         this.menu$.next(mensaMenu);
  //         menu.forEach((menuItem) => {
  //           if (!processedDishes.has(menuItem)) {
  //             this.fetchReviewsAndPicturesForDish(menuItem.id);
  //             processedDishes.add(menuItem);
  //           }
  //         });
  //       });
  //     }
  //   }
  // }

  public fetchReviewsAndPicturesForDish(dishid: number) {
    this.api
      .fetchRatings(dishid)
      .then((ratings) => {
        console.log(ratings);
        this.menuRatings$.next(ratings);
      })
      .catch((error) => {
        this.menuRatings$.next(null);
      });
    this.api
      .fetchPictures(dishid)
      .then((pictures) => {
        this.menuPictures$.next(pictures);
      })
      .catch((error) => {
        this.menuPictures$.next(null);
      });
  }

  private saveStateToLocalStorage() {
    const state: State = {
      dishes: this.dishes$.getValue(),
      menus: this.menu$.getValue(),
      ratings: this.menuRatings$.getValue(),
      pictures: this.menuPictures$.getValue(),
      user: this.user$.getValue(),
      selectedMensa: this.selectedMensa$.getValue(),
      compactMode: this.compactMode$.getValue(),
    };
    localStorage.setItem("mensa-state", JSON.stringify(state));
  }

  private loadStateFromLocalStorage() {
    const stateString = localStorage.getItem("mensa-state");
    if (stateString) {
      const state: State = JSON.parse(stateString);

      if (state.dishes) {
        this.dishes$.next(state.dishes);
      }
      if (state.menus) {
        this.menu$.next(state.menus);
      }
      if (state.ratings) {
        this.menuRatings$.next(state.ratings);
      }
      if (state.pictures) {
        this.menuPictures$.next(state.pictures);
      }
      if (state.user != null) {
        this.user$.next(state.user);
      }
      if (state.selectedMensa != null) {
        this.selectedMensa$.next(state.selectedMensa);
      }
      if (state.compactMode != null) {
        this.compactMode$.next(state.compactMode);
      }
    }
  }

  //subscribes to the app state and saves the change to the localstorage
  initLocalStorageSave() {
    const saveFunc = () => this.saveStateToLocalStorage();
    this.menu.subscribe(saveFunc);
    this.menuRatings$.subscribe(saveFunc);
    this.menuPictures$.subscribe(saveFunc);

    this.user.pipe(distinctUntilChanged()).subscribe((user) => {
      if (user) {
        this.api.setCredentials(
          user.profile.preferred_username,
          user.profile.sub,
          user.access_token
        );
      } else {
        this.api.resetCredentials();
      }
      saveFunc();
    });

    this.selectedMensa$.subscribe(saveFunc);
    this.compactMode$.subscribe(saveFunc);
  }
}
