import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddShopPage } from './add-shop.page';

const routes: Routes = [
  {
    path: '',
    component: AddShopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddShopPageRoutingModule {}
