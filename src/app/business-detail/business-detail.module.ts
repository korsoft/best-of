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
    AgmCoreModule.forRoot({apiKey: 'AIzaSyCxIDgJinuu5t2otiLCHf3yj7cH4QMG_m0'})
  ]
})
export class BusinessDetailModule { }
