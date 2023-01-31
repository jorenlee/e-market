import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ChangebuttonComponent } from 'src/app/components/changebutton/changebutton.component';
import { Address } from 'src/app/models/address.model';
import { Cart } from 'src/app/models/cart.model';
// import { Order } from 'src/app/models/order.model';
import { AddressService } from 'src/app/services/address/address.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';
import {ApiService} from "../../../services/api/api.service"

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {

  @ViewChild(IonContent, {static: false}) content: IonContent;
  urlCheck: any;
  url: any;
  model = {} as Cart;
  deliveryCharge = 20;
  instruction: any;
  location = {} as Address;
  cartSub: Subscription;
  addressSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private orderService: OrderService,
    private global: GlobalService,
    private cartService: CartService,
    private addressService: AddressService,
    private api:ApiService
  ) { }

  ngOnInit() {
    this.addressSub = this.addressService.addressChange.subscribe(address => {
      this.location = address;
    });
    this.cartSub = this.cartService.cart.subscribe(cart => {
      console.log('cart page: ', cart);
      this.model = cart;
      if(!this.model) this.location = {} as Address;
      console.log('cart page model: ', this.model);
    })
    this.getData();
  }

  async getData() {
    await this.checkUrl();
    await this.cartService.getCartData();
  }

  checkUrl() {
    let url: any = (this.router.url).split('/');
    console.log('url: ', url);
    const spliced = url.splice(url.length - 2, 2); // /tabs/cart url.length - 1 - 1
    this.urlCheck = spliced[0];
    console.log('urlcheck: ', this.urlCheck);
    url.push(this.urlCheck);
    this.url = url;
    console.log(this.url);
  }

  getPreviousUrl() {
    return this.url.join('/');
  }

  quantityPlus(index) {
    this.cartService.quantityPlus(index);
  }

  quantityMinus(index) {
    this.cartService.quantityMinus(index);
  }

  addAddress() {
    let url: any;
    if(this.urlCheck == 'tabs') url = ['/', 'tabs', 'address', 'edit-address'];
    else url = [this.router.url, 'address', 'edit-address'];
    this.router.navigate(url);
  }

  async changeAddress() {
    try {
      const options = {
        component: ChangebuttonComponent,
        swipeToClose: true,
        cssClass: 'custom-modal',
        componentProps: {
          from: 'cart'
        }
      };
      const address = await this.global.createModal(options);
      if(address) {
        if(address == 'add') this.addAddress();
        await this.addressService.changeAddress(address);
      }
    } catch(e) {
      console.log(e);
    }
  }

  async makePayment() {
    try {
      console.log('model: ', this.model);
      const data = {
        shop_id: this.model.shop.uid,
        instruction: this.instruction ? this.instruction : '',
        shop: this.model.shop,
        order: this.model.items, //JSON.stringify(this.model.items)
        time: moment().format('lll'),
        address: this.location,
        total: this.model.totalPrice,
        grandTotal: this.model.grandTotal,
        deliveryCharge: this.deliveryCharge,
        status: 'Created',
        paid: 'COD'
      };
      console.log('order: ', data);
      
      await this.orderService.placeOrder(data);
      // clear cart
      await this.cartService.clearCart();
      this.model = {} as Cart;
      this.global.successToast('Your Order is Placed Successfully');
      this.api.getTokens(data.shop.email);
      this.navCtrl.navigateRoot(['tabs/account']);
    } catch(e) {
      console.log(e);
    }
  }

  scrollToBottom() {
    this.content.scrollToBottom(500);
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave CartPage');
    if(this.model?.items && this.model?.items.length > 0) {
      this.cartService.saveCart();
    }
  }

  ngOnDestroy() {
    console.log('Destroy CartPage');
    if(this.addressSub) this.addressSub.unsubscribe();
    if(this.cartSub) this.cartSub.unsubscribe();
  }
}
