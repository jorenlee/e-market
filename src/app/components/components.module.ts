import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EmptyScreenComponent } from './empty-screen/empty-screen.component';
import { ChangebuttonComponent } from './changebutton/changebutton.component';
import { EmarketComponent } from './emarket/emarket.component';
import { UserShopcomponentsComponent } from './user-shopcomponents/user-shopcomponents.component';
import { LoadingShopsComponent } from './loading-shops/loading-shops.component';



@NgModule({
  declarations: [
    EmptyScreenComponent,
    ChangebuttonComponent,
    EmarketComponent,
    UserShopcomponentsComponent,
    LoadingShopsComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    EmptyScreenComponent,
    ChangebuttonComponent,
    EmarketComponent,
    UserShopcomponentsComponent,
    LoadingShopsComponent

  ],
  // only those components not defined in template 
  entryComponents: [ChangebuttonComponent]
})
export class ComponentsModule { }
