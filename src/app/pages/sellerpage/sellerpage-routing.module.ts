import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellerpagePage } from './sellerpage.page';

const routes: Routes = [
  {
    path: '',
    component: SellerpagePage
  },
  {
    path: 'add-shop',
    loadChildren: () => import('./add-shop/add-shop.module').then( m => m.AddShopPageModule)
  },
  {
    path: 'add-product',
    loadChildren: () => import('./add-product/add-product.module').then( m => m.AddProductPageModule)
  },
  {
    path: 'user-shopboard',
    loadChildren: () => import('./user-shopboard/user-shopboard.module').then( m => m.UserShopboardPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerpagePageRoutingModule {}
