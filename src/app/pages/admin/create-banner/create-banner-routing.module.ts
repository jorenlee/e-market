import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateBannerPage } from './create-banner.page';

const routes: Routes = [
  {
    path: '',
    component: CreateBannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateBannerPageRoutingModule {}
