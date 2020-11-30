import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { environment } from "../environments/environment";
import { merge } from "lodash";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { menuItem } from "./models/menu";

export interface Rating {
  author: string;
  stars: number;
  comment: string;
  mensa: string;
  timestamp: string;
}

export interface RatingCollection {
  // user ID
  [key: string]: Rating;
}

export interface Picture {
  image: string;
  author: string;
}

export interface PictureCollection {
  // user ID
  [key: string]: Picture[];
}

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
    return this.http.request<T>(options.method, url, ngHttpOptions).toPromise();
  }

  async fetchDishes(): Promise<string[]> {
    const url = ApiService.joinAbsoluteUrlPath(
      environment.las2peerWebConnectorUrl,
      this.MENSA_SERVICE_PATH,
      this.MENSA_SERVICE_DISHES_PATH
    );
    return this.makeRequest<string[]>(url);
  }

  async fetchMenu(mensa: string): Promise<menuItem[]> {
    const url = ApiService.joinAbsoluteUrlPath(
      environment.las2peerWebConnectorUrl,
      this.MENSA_SERVICE_PATH,
      encodeURIComponent(mensa) + "?format=json"
    );
    return this.makeRequest<menuItem[]>(url);
  }

  async fetchRatings(dish: string): Promise<RatingCollection> {
    const url = ApiService.joinAbsoluteUrlPath(
      environment.las2peerWebConnectorUrl,
      this.MENSA_SERVICE_PATH,
      this.MENSA_SERVICE_DISHES_PATH,
      encodeURIComponent(dish),
      this.MENSA_SERVICE_RATINGS_PATH
    );
    return this.makeRequest<RatingCollection>(url);
  }

  async fetchPictures(dish: string): Promise<PictureCollection> {
    const url = ApiService.joinAbsoluteUrlPath(
      environment.las2peerWebConnectorUrl,
      this.MENSA_SERVICE_PATH,
      this.MENSA_SERVICE_DISHES_PATH,
      encodeURIComponent(dish),
      this.MENSA_SERVICE_PICTURES_PATH
    );
    return this.makeRequest<PictureCollection>(url);
  }

  async addRating(dish: string, rating: Rating): Promise<RatingCollection> {
    const url = ApiService.joinAbsoluteUrlPath(
      environment.las2peerWebConnectorUrl,
      this.MENSA_SERVICE_PATH,
      this.MENSA_SERVICE_DISHES_PATH,
      encodeURIComponent(dish),
      this.MENSA_SERVICE_RATINGS_PATH
    );
    return this.makeRequest<RatingCollection>(url, {
      method: "POST",
      body: JSON.stringify(rating),
    });
  }

  async deleteRating(dish: string): Promise<RatingCollection> {
    const url = ApiService.joinAbsoluteUrlPath(
      environment.las2peerWebConnectorUrl,
      this.MENSA_SERVICE_PATH,
      this.MENSA_SERVICE_DISHES_PATH,
      encodeURIComponent(dish),
      this.MENSA_SERVICE_RATINGS_PATH
    );
    return this.makeRequest<RatingCollection>(url, { method: "DELETE" });
  }

  async addPicture(dish: string, picture: Picture): Promise<PictureCollection> {
    const url = ApiService.joinAbsoluteUrlPath(
      environment.las2peerWebConnectorUrl,
      this.MENSA_SERVICE_PATH,
      this.MENSA_SERVICE_DISHES_PATH,
      encodeURIComponent(dish),
      this.MENSA_SERVICE_PICTURES_PATH
    );
    return this.makeRequest<PictureCollection>(url, {
      method: "POST",
      body: JSON.stringify(picture),
    });
  }

  async deletePicture(
    dish: string,
    picture: Picture
  ): Promise<PictureCollection> {
    const url = ApiService.joinAbsoluteUrlPath(
      environment.las2peerWebConnectorUrl,
      this.MENSA_SERVICE_PATH,
      this.MENSA_SERVICE_DISHES_PATH,
      encodeURIComponent(dish),
      this.MENSA_SERVICE_PICTURES_PATH
    );
    return this.makeRequest<PictureCollection>(url, {
      method: "DELETE",
      body: JSON.stringify(picture),
    });
  }
}
