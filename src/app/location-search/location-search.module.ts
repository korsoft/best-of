import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { LocationSearchComponent } from './location-search.component';



@NgModule({
  declarations: [LocationSearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class LocationSearchModule { }
