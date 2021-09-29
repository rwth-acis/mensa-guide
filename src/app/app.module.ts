import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../environments/environment';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { OidcSilentComponent } from './oidc-silent/oidc-silent.component';
import { OidcSignoutComponent } from './oidc-signout/oidc-signout.component';
import { OidcSigninComponent } from './oidc-signin/oidc-signin.component';
import { MatListModule } from '@angular/material/list';
import { TodaysMenuComponent } from './todays-menu/todays-menu.component';
import { DishesComponent } from './dishes/dishes.component';
import { NgxHmCarouselModule } from 'ngx-hm-carousel';
import { MatCardModule } from '@angular/material/card';
import { DishCarouselComponent } from './dish-carousel/dish-carousel.component';
import { FormsModule } from '@angular/forms';
import { DishCardComponent } from './dish-card/dish-card.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ReviewFormComponent } from './review-form/review-form.component';
import { DeletePictureDialogComponent } from './delete-picture-dialog/delete-picture-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { AverageStarsComponent } from './average-stars/average-stars.component';

const config = {
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
    ImageDialogComponent,
    AverageStarsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule,
    NgxHmCarouselModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSliderModule,
    MatDialogModule,
    MatSlideToggleModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ReviewsComponent,
    DeletePictureDialogComponent,
    ImageDialogComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
};

@NgModule(config)
export class AppModule {}
