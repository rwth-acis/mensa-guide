import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest } from "rxjs";
import { ApiService } from "./api.service";
import { ConnectionService } from "./connection.service";
import {
  combineAll,
  distinctUntilChanged,
  filter,
  map,
  tap,
  throttleTime,
} from "rxjs/operators";
import { isEqual } from "lodash";
import { Dish, MensaMenus, menuItem } from "./models/menu";
import { Rating, ReviewForm } from "./models/rating";
import { Picture } from "./models/picture";

export interface State {
  dishes: Dish[];
  menu: menuItem[];
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
    { name: "Aachen, Mensa Academica", id: 187 },
    { name: "Aachen, Mensa Ahorn", id: 95 },
    { name: "Aachen, Mensa Vita", id: 96 },
  ];
  //private intervalHandle: NodeJS.Timer;

  //Subjects
  private selectedMensa$ = new BehaviorSubject<string>(null);
  private user$ = new BehaviorSubject(null);
  private dishes$ = new BehaviorSubject<Dish[]>([]);
  private menu$ = new BehaviorSubject<menuItem[]>(null);
  private menuRatings$ = new BehaviorSubject<Rating[]>(null);
  private menuPictures$ = new BehaviorSubject<Picture[]>(null);
  private online$ = new BehaviorSubject<boolean>(true);
  private compactMode$ = new BehaviorSubject<boolean>(false);
  private selectedDish$ = new BehaviorSubject<Dish>(null);

  constructor(private api: ApiService, private connection: ConnectionService) {
    //  this.loadStateFromLocalStorage();
    this.connection.monitor().subscribe((online) => this.online$.next(online));

    // this.initLocalStorageSave();
  }

  //Getters for Observables
  public get dishes() {
    return this.dishes$.asObservable();
  }

  public get menu() {
    return this.menu$
      .asObservable()
      .pipe(
        map((dishes) =>
          dishes
            ? dishes.filter(
                (dish) => dish.name !== "geschlossen" && dish.name !== "closed"
              )
            : null
        )
      );
  }

  public get menuRatings() {
    return this.menuRatings$.asObservable();
  }

  public get menuPictures() {
    return this.menuPictures$.asObservable();
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
    // this.saveStateToLocalStorage();
  }

  setSelectedMensa(mensa) {
    this.selectedMensa$.next(mensa);
    this.menu$.next(null);
    this.api.fetchMenu(mensa).subscribe((menu) => {
      this.menu$.next(menu);
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
    this.api.fetchDishes().subscribe((dishes) => {
      this.dishes$.next(dishes);
    });
  }

  addPicture(dishId: number, picture: Picture) {
    console.log("got pic", picture.image);
    return this.api.addPicture(dishId, picture).pipe(
      tap((updatedPictures) => {
        const pictures = this.menuPictures$.getValue();
        pictures[dishId] = updatedPictures;
        this.menuPictures$.next(pictures);
      })
    );
  }

  deletePicture(dish: string, picture: Picture) {
    return this.api.deletePicture(dish, picture).pipe(
      tap((updatedPictures) => {
        let pictures = this.menuPictures$.getValue();
        pictures = pictures.filter((pic) => pic != picture);
        this.menuPictures$.next(pictures);
      })
    );
  }

  addReview(dishId: number, review: ReviewForm) {
    let user = this.user$.getValue();
    review.author = user.profile.preferred_username;
    return this.api.addRating(dishId, review).pipe(
      tap((newRating) => {
        let reviews = this.menuRatings$.getValue();
        reviews.push({
          ...newRating,
          timestamp: new Date(),
          mensa: this.mensas.find((mensa) => mensa.id == newRating.mensaId)
            .name,
        });
        this.menuRatings$.next(reviews);
      })
    );
  }

  deleteReview(dishId: number) {
    return this.api.deleteRating(dishId).pipe(
      tap((success) => {
        if (success) {
          let reviews = this.menuRatings$.getValue();
          reviews.filter((review) => review.id != dishId);
          this.menuRatings$.next(reviews);
        }
      })
    );
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
    this.api.fetchRatings(dishid).subscribe(
      (ratings) => {
        this.menuRatings$.next(ratings);
      },
      (error) => {
        this.menuRatings$.next([]);
      }
    );

    this.api.fetchPictures(dishid).subscribe(
      (pictures) => {
        this.menuPictures$.next(pictures);
      },
      (error) => {
        this.menuPictures$.next([]);
      }
    );
  }

  private saveStateToLocalStorage() {
    const state: State = {
      dishes: this.dishes$.getValue(),
      menu: this.menu$.getValue(),
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
      if (state.menu) {
        this.menu$.next(state.menu);
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
