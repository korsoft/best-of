import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavoritesSharedPage } from './favorites-shared.page';

const routes: Routes = [
  {
    path: '',
    component: FavoritesSharedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoritesSharedPageRoutingModule {}
