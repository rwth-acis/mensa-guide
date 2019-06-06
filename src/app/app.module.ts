import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';

import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {OidcSilentComponent} from './oidc-silent/oidc-silent.component';
import {OidcSignoutComponent} from './oidc-signout/oidc-signout.component';
import {OidcSigninComponent} from './oidc-signin/oidc-signin.component';
import {
  MatButtonModule,
  MatCardModule, MatDialogModule,
  MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule, MatSliderModule,
  MatSnackBarModule
} from '@angular/material';
import {MatProgressButtonsModule} from 'mat-progress-buttons';
import {TodaysMenuComponent} from './todays-menu/todays-menu.component';
import {DishesComponent} from './dishes/dishes.component';
import {NgxHmCarouselModule} from 'ngx-hm-carousel';
import {DishCarouselComponent} from './dish-carousel/dish-carousel.component';
import {FormsModule} from '@angular/forms';
import {DishCardComponent} from './dish-card/dish-card.component';
import {ReviewsComponent} from './reviews/reviews.component';
import {ReviewFormComponent} from './review-form/review-form.component';
import { DeletePictureDialogComponent } from './delete-picture-dialog/delete-picture-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    OidcSigninComponent,
    OidcSignoutComponent,
    OidcSilentComponent,
    TodaysMenuComponent,
    DishesComponent,
    DishCarouselComponent,
    DishCardComponent,
    ReviewsComponent,
    ReviewFormComponent,
    DeletePictureDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG}),
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule,
    NgxHmCarouselModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatProgressButtonsModule.forRoot(),
    MatInputModule,
    MatSliderModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ReviewsComponent, DeletePictureDialogComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {
}
