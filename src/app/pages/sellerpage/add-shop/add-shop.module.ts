import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddShopPageRoutingModule } from './add-shop-routing.module';

import { AddShopPage } from './add-shop.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddShopPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AddShopPage]
})
export class AddShopPageModule {}
