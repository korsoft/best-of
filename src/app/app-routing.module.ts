import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MapViewComponent } from './map-view/map-view.component';
import { BusinessDetailComponent } from './business-detail/business-detail.component';
import { LocationSearchComponent } from './location-search/location-search.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id/:name',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
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
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./feedback/feedback.module').then( m => m.FeedbackPageModule)
  },
  {
    path: 'become-of-sponsor',
    loadChildren: () => import('./become-of-sponsor/become-of-sponsor.module').then( m => m.BecomeOfSponsorPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
