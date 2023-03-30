import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoritesSharedPageRoutingModule } from './favorites-shared-routing.module';

import { FavoritesSharedPage } from './favorites-shared.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoritesSharedPageRoutingModule
  ],
  declarations: [FavoritesSharedPage]
})
export class FavoritesSharedPageModule {}
