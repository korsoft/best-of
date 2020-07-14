import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolderPage } from './folder.page';
import { MapViewComponent } from '../map-view/map-view.component';


const routes: Routes = [
  {
    path: '',
    component: FolderPage
  },
  {
    path: 'mapView',
    component: MapViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}
