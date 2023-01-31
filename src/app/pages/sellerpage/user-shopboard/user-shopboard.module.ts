import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserShopboardPageRoutingModule } from './user-shopboard-routing.module';

import { UserShopboardPage } from './user-shopboard.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserShopboardPageRoutingModule,
    ComponentsModule
  ],
  declarations: [UserShopboardPage]
})
export class UserShopboardPageModule {}
