import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StoreService} from './store.service';
import {environment} from '../environments/environment';
import 'oidc-client';
import 'las2peer-frontend-statusbar/las2peer-frontend-statusbar.js';
import {CordovaPopupNavigator, UserManager} from 'oidc-client';
import {MediaMatcher} from '@angular/cdk/layout';
import {MatSidenav, MatSnackBar} from '@angular/material';
import {SwUpdate} from '@angular/service-worker';
import {Router} from '@angular/router';

// workaround for openidconned-signin
// remove when the lib imports with "import {UserManager} from 'oidc-client';" instead of "import 'oidc-client';"
// this kind of import does not work with oidc-client@1.6.1 for some strange reason
declare global {
  interface Window {
    UserManager: any;
    CordovaPopupNavigator: any;
  }
}
window.UserManager = UserManager;
window.CordovaPopupNavigator = CordovaPopupNavigator;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav, {static: false})
  public sidenav: MatSidenav;

  title = 'Mensa Guide';
  mobileQuery: MediaQueryList;
  mobileQueryListener: () => void;
  user;
  signedIn = false;
  environment = environment;

  constructor(private store: StoreService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private swUpdate: SwUpdate,
              private snackBar: MatSnackBar, private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    /* tslint:disable-next-line */
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnDestroy(): void {
    /* tslint:disable-next-line */
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
    // swipe navigation
    // disabled for now because it interferes with image carousel swiping
    /*const hammertime = new Hammer(this.elementRef.nativeElement, {});
    hammertime.on('panright', () => {
      if (this.mobileQuery.matches) {
        this.sidenav.open();
      }
    });
    hammertime.on('panleft', () => {
      if (this.mobileQuery.matches) {
        this.sidenav.close();
      }
    });*/
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        const snackBarRef = this.snackBar.open('New version available. Reload to update.', 'Reload', null);
        snackBarRef.onAction().subscribe(() => {
          window.location.reload();
        });
      });
    }
    this.store.user.subscribe(user => {
      this.user = user;
      this.signedIn = !!user;
    });
  }

  menuItemClicked() {
    if (this.mobileQuery.matches) {
      this.sidenav.toggle();
    }
  }

  setUser(user) {
    if (user === null) {
      new UserManager({}).signoutRedirectCallback().then(() => {
        this.router.navigate(['/']);
      });
    }
    this.store.setUser(user);
  }
}
