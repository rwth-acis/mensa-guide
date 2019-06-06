import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {environment} from '../environments/environment';
import {merge} from 'lodash';

export interface Menu {
  extras: object;
  menus: object;
}

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
  providedIn: 'root'
})
export class ApiService {
  userCredentials;
  MENSA_SERVICE_PATH = 'mensa';
  MENSA_SERVICE_DISHES_PATH = 'dishes';
  MENSA_SERVICE_RATINGS_PATH = 'ratings';
  MENSA_SERVICE_PICTURES_PATH = 'pictures';

  constructor(private logger: NGXLogger) {
  }

  static joinAbsoluteUrlPath(...args) {
    return args.map(pathPart => pathPart.replace(/(^\/|\/$)/g, '')).join('/');
  }

  setCredentials(username, password, accessToken) {
    this.userCredentials = {user: username, password, token: accessToken};
  }

  resetCredentials() {
    this.userCredentials = null;
  }

  async makeRequest(url: string, options: RequestInit = {}) {
    options = merge({
      headers: {
        'Content-Type': 'application/json',
        'accept-language': 'en-US',
      }
    }, options);
    if (this.userCredentials) {
      const username = this.userCredentials.user;
      const password = this.userCredentials.password;
      const token = this.userCredentials.token;
      options = merge(options, {
        headers: {
          Authorization: 'Basic ' + btoa(username + ':' + password),
          access_token: token,
        }
      });
    }
    this.logger.debug('Fetching from ' + url + ' with options ' + JSON.stringify(options));
    return new Promise<Response>((resolve, reject) => {
      fetch(url, options).then((response) => {
        if (response.ok) {
          resolve(response);
        } else {
          reject(response);
        }
      }).catch(reject);
    });
  }

  async fetchDishes(): Promise<string[]> {
    const url = ApiService.joinAbsoluteUrlPath(environment.las2peerWebConnectorUrl, this.MENSA_SERVICE_PATH,
      this.MENSA_SERVICE_DISHES_PATH);
    return this.makeRequest(url).then((response) => response.json());
  }

  async fetchMenu(mensa: string): Promise<Menu> {
    const url = ApiService.joinAbsoluteUrlPath(environment.las2peerWebConnectorUrl, this.MENSA_SERVICE_PATH,
      encodeURI(mensa) + '?format=json');
    return this.makeRequest(url).then((response) => response.json());
  }

  async fetchRatings(dish: string): Promise<RatingCollection> {
    const url = ApiService.joinAbsoluteUrlPath(environment.las2peerWebConnectorUrl, this.MENSA_SERVICE_PATH, this.MENSA_SERVICE_DISHES_PATH,
      encodeURI(dish), this.MENSA_SERVICE_RATINGS_PATH);
    return this.makeRequest(url).then((response) => response.json());
  }

  async fetchPictures(dish: string): Promise<PictureCollection> {
    const url = ApiService.joinAbsoluteUrlPath(environment.las2peerWebConnectorUrl, this.MENSA_SERVICE_PATH, this.MENSA_SERVICE_DISHES_PATH,
      encodeURI(dish), this.MENSA_SERVICE_PICTURES_PATH);
    return this.makeRequest(url).then((response) => response.json());
  }

  async addRating(dish: string, rating: Rating): Promise<RatingCollection> {
    const url = ApiService.joinAbsoluteUrlPath(environment.las2peerWebConnectorUrl, this.MENSA_SERVICE_PATH, this.MENSA_SERVICE_DISHES_PATH,
      encodeURI(dish), this.MENSA_SERVICE_RATINGS_PATH);
    return this.makeRequest(url, {method: 'POST', body: JSON.stringify(rating)}).then((response) => response.json());
  }

  async deleteRating(dish: string): Promise<RatingCollection> {
    const url = ApiService.joinAbsoluteUrlPath(environment.las2peerWebConnectorUrl, this.MENSA_SERVICE_PATH, this.MENSA_SERVICE_DISHES_PATH,
      encodeURI(dish), this.MENSA_SERVICE_RATINGS_PATH);
    return this.makeRequest(url, {method: 'DELETE'}).then((response) => response.json());
  }

  async addPicture(dish: string, picture: Picture): Promise<PictureCollection> {
    const url = ApiService.joinAbsoluteUrlPath(environment.las2peerWebConnectorUrl, this.MENSA_SERVICE_PATH, this.MENSA_SERVICE_DISHES_PATH,
      encodeURI(dish), this.MENSA_SERVICE_PICTURES_PATH);
    return this.makeRequest(url, {method: 'POST', body: JSON.stringify(picture)}).then((response) => response.json());
  }

  async deletePicture(dish: string, picture: Picture): Promise<PictureCollection> {
    const url = ApiService.joinAbsoluteUrlPath(environment.las2peerWebConnectorUrl, this.MENSA_SERVICE_PATH, this.MENSA_SERVICE_DISHES_PATH,
      encodeURI(dish), this.MENSA_SERVICE_PICTURES_PATH);
    return this.makeRequest(url, {method: 'DELETE', body: JSON.stringify(picture)}).then((response) => response.json());
  }
}
