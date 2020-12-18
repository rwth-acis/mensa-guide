import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { environment } from "../environments/environment";
import { merge } from "lodash";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Dish, menuItem } from "./models/menu";
import { Rating } from "./models/rating";
import { Picture } from "./models/picture";
import { tap, timeout } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  userCredentials;
  MENSA_SERVICE_PATH = "mensa";
  MENSA_SERVICE_DISHES_PATH = "dishes";
  MENSA_SERVICE_RATINGS_PATH = "ratings";
  MENSA_SERVICE_PICTURES_PATH = "pictures";

  constructor(private http: HttpClient, private logger: NGXLogger) {}

  static joinAbsoluteUrlPath(...args) {
    return args.map((pathPart) => pathPart.replace(/(^\/|\/$)/g, "")).join("/");
  }

  setCredentials(username, password, accessToken) {
    this.userCredentials = { user: username, password, token: accessToken };
  }

  resetCredentials() {
    this.userCredentials = null;
  }

  async makeRequest<T>(
    url: string,
    options: {
      method?: string;
      headers?: {
        [header: string]: string | string[];
      };
      body?: string;
    } = {}
  ) {
    options = merge(
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "accept-language": "en-US",
        },
      },
      options
    );
    if (this.userCredentials) {
      const username = this.userCredentials.user;
      const password = this.userCredentials.password;
      const token = this.userCredentials.token;
      options = merge(options, {
        headers: {
          Authorization: "Basic " + btoa(username + ":" + password),
          access_token: token,
        },
      });
    }
    this.logger.debug(
      "Fetching from " + url + " with options " + JSON.stringify(options)
    );
    const ngHttpOptions: {
      body?: any;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: "body";
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      responseType?: "json";
      reportProgress?: boolean;
      withCredentials?: boolean;
    } = {};
    if (options.headers) {
      ngHttpOptions.headers = new HttpHeaders(options.headers);
    }
    if (options.body) {
      ngHttpOptions.body = options.body;
    }
    return this.http
      .request<T>(options.method, url, ngHttpOptions)
      .pipe(
        timeout(120000),
        tap(
          () => {},
          (e) => {
            console.error(e);
          }
        )
      )
      .toPromise();
  }

  async fetchDishes(): Promise<Dish[]> {
    const url = ApiService.joinAbsoluteUrlPath(
      environment.las2peerWebConnectorUrl,
      this.MENSA_SERVICE_PATH,
      this.MENSA_SERVICE_DISHES_PATH
    );
    return this.makeRequest<Dish[]>(url);
  }

  async fetchMenu(mensa: string): Promise<menuItem[]> {
    const url = ApiService.joinAbsoluteUrlPath(
      environment.las2peerWebConnectorUrl,
      this.MENSA_SERVICE_PATH,
      encodeURIComponent(mensa) + "?format=json"
    );
    return this.makeRequest<menuItem[]>(url);
  }

  async fetchRatings(dishId: number): Promise<Rating[]> {
    const url = ApiService.joinAbsoluteUrlPath(
      environment.las2peerWebConnectorUrl,
      this.MENSA_SERVICE_PATH,
      this.MENSA_SERVICE_DISHES_PATH,
      dishId.toString(),
      this.MENSA_SERVICE_RATINGS_PATH
    );
    return this.makeRequest<Rating[]>(url);
  }

  async fetchPictures(dishId: number): Promise<Picture[]> {
    const url = ApiService.joinAbsoluteUrlPath(
      environment.las2peerWebConnectorUrl,
      this.MENSA_SERVICE_PATH,
      this.MENSA_SERVICE_DISHES_PATH,
      dishId.toString(),
      this.MENSA_SERVICE_PICTURES_PATH
    );
    return this.makeRequest<Picture[]>(url);
  }

  async addRating(dishId: number, rating: Rating): Promise<Rating> {
    const url = ApiService.joinAbsoluteUrlPath(
      environment.las2peerWebConnectorUrl,
      this.MENSA_SERVICE_PATH,
      this.MENSA_SERVICE_DISHES_PATH,
      dishId.toString(),
      this.MENSA_SERVICE_RATINGS_PATH
    );
    return this.makeRequest<Rating>(url, {
      method: "POST",
      body: JSON.stringify(rating),
    });
  }

  async deleteRating(dishid: number): Promise<boolean> {
    const url = ApiService.joinAbsoluteUrlPath(
      environment.las2peerWebConnectorUrl,
      this.MENSA_SERVICE_PATH,
      this.MENSA_SERVICE_DISHES_PATH,
      dishid.toString(),
      this.MENSA_SERVICE_RATINGS_PATH
    );
    return this.makeRequest<boolean>(url, { method: "DELETE" });
  }

  async addPicture(dishid: number, picture: Picture): Promise<Picture> {
    const url = ApiService.joinAbsoluteUrlPath(
      environment.las2peerWebConnectorUrl,
      this.MENSA_SERVICE_PATH,
      this.MENSA_SERVICE_DISHES_PATH,
      dishid.toString(),
      this.MENSA_SERVICE_PICTURES_PATH
    );
    return this.makeRequest<Picture>(url, {
      method: "POST",
      body: JSON.stringify(picture),
    });
  }

  async deletePicture(dish: string, picture: Picture): Promise<boolean> {
    const url = ApiService.joinAbsoluteUrlPath(
      environment.las2peerWebConnectorUrl,
      this.MENSA_SERVICE_PATH,
      this.MENSA_SERVICE_DISHES_PATH,
      encodeURIComponent(dish),
      this.MENSA_SERVICE_PICTURES_PATH
    );
    return this.makeRequest<boolean>(url, {
      method: "DELETE",
      body: JSON.stringify(picture),
    });
  }
}
