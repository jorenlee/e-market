import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateBannerPageRoutingModule } from './create-banner-routing.module';

import { CreateBannerPage } from './create-banner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateBannerPageRoutingModule
  ],
  declarations: [CreateBannerPage]
})
export class CreateBannerPageModule {}
