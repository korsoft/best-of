import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusinessDetailComponent } from './business-detail.component';
import { IonicModule } from '@ionic/angular';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';



@NgModule({
  declarations: [BusinessDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyCnT_vhNISZ6G1a-9rYM1ha_J8TJ6KSnyY'})
  ]
})
export class BusinessDetailModule { }
