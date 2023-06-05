import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapViewComponent } from './map-view.component';
import { IonicModule } from '@ionic/angular';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyCnT_vhNISZ6G1a-9rYM1ha_J8TJ6KSnyY'}),
    AgmDirectionModule
  ],
  declarations: [MapViewComponent]
})
export class MapViewModule { }
