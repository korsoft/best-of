import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BecomeOfSponsorPage } from './become-of-sponsor.page';

const routes: Routes = [
  {
    path: '',
    component: BecomeOfSponsorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BecomeOfSponsorPageRoutingModule {}
