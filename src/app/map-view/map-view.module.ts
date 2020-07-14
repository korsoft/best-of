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
    AgmCoreModule.forRoot({apiKey: 'AIzaSyCxIDgJinuu5t2otiLCHf3yj7cH4QMG_m0'}),
    AgmDirectionModule
  ],
  declarations: [MapViewComponent]
})
export class MapViewModule { }
