import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BecomeOfSponsorPageRoutingModule } from './become-of-sponsor-routing.module';

import { BecomeOfSponsorPage } from './become-of-sponsor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BecomeOfSponsorPageRoutingModule
  ],
  declarations: [BecomeOfSponsorPage]
})
export class BecomeOfSponsorPageModule {}
