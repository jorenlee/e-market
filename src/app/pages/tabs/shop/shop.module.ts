import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopPageRoutingModule } from './shop-routing.module';

import { ShopPage } from './shop.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ShopDetailsComponent } from 'src/app/components/shop-details/shop-details.component';
import { ItemComponent } from 'src/app/components/item/item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ShopPage, ShopDetailsComponent, ItemComponent]
})
export class ShopPageModule {}
