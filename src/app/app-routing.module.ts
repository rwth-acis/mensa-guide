import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OidcSilentComponent} from './oidc-silent/oidc-silent.component';
import {OidcSigninComponent} from './oidc-signin/oidc-signin.component';
import {OidcSignoutComponent} from './oidc-signout/oidc-signout.component';
import {TodaysMenuComponent} from './todays-menu/todays-menu.component';
import {DishesComponent} from './dishes/dishes.component';

const routes: Routes = [
  {path: '', component: TodaysMenuComponent},
  {path: 'dishes', component: DishesComponent},
  {path: 'oidc-signin', component: OidcSigninComponent},
  {path: 'oidc-signout', component: OidcSignoutComponent},
  {path: 'oidc-silent', component: OidcSilentComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
