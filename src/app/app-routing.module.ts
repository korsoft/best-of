import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MapViewComponent } from './map-view/map-view.component';
import { BusinessDetailComponent } from './business-detail/business-detail.component';
import { LocationSearchComponent } from './location-search/location-search.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetComponent } from './auth/reset/reset.component';
import { DeleteAccountComponent } from './auth/delete-account/delete-account.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'folder/:location/:id/:name',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'resetPassword',
    component: ResetComponent
  },
  {
    path: 'deleteAccount',
    component: DeleteAccountComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'home/:location',
    component: HomeComponent
  },
  {
    path: 'mapView',
    component: MapViewComponent
  },
  {
    path: 'businessDetail/:id',
    component: BusinessDetailComponent
  },
  {
    path: 'select-location',
    component: LocationSearchComponent
  },
  {
    path: 'notification/:id',
    loadChildren: () => import('./pages/notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'website/:id',
    loadChildren: () => import('./website/website.module').then( m => m.WebsitePageModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./pages/favorites/favorites.module').then( m => m.FavoritesPageModule)
  },
  {
    path: 'favorites/:fromFirebaseUID',
    loadChildren: () => import('./pages/favorites/favorites.module').then( m => m.FavoritesPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./feedback/feedback.module').then( m => m.FeedbackPageModule),
    
  },
  {
    path: 'become-of-sponsor',
    loadChildren: () => import('./become-of-sponsor/become-of-sponsor.module').then( m => m.BecomeOfSponsorPageModule)
  },
  {
    path: 'favorites-shared',
    loadChildren: () => import('./pages/favorites-shared/favorites-shared.module').then( m => m.FavoritesSharedPageModule)
  },
  {
    path: 'favorites-shared/:fromFirebaseUID',
    loadChildren: () => import('./pages/favorites-shared/favorites-shared.module').then( m => m.FavoritesSharedPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
