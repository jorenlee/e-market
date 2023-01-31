import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SellerpagePageRoutingModule } from './sellerpage-routing.module';

import { SellerpagePage } from './sellerpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SellerpagePageRoutingModule
  ],
  declarations: [SellerpagePage]
})
export class SellerpagePageModule {}
