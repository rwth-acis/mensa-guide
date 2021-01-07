// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  openIdAuthorityUrl: "https://api.learning-layers.eu/o/oauth2",
  openIdClientId: "f8622260-875b-499a-82db-db55f89f9deb",
  las2peerWebConnectorUrl:
    window.hasOwnProperty("env") && window["env"].hasOwnProperty("apiUrl") //check if apiurl is set by docker.
      ? window["env"]["apiUrl"]
      : "http://127.0.0.1:8080",
  debug: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
