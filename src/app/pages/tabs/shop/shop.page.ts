import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Shop } from "src/app/models/shop.model";
import { ApiService } from "src/app/services/api/api.service";
import { CartService } from 'src/app/services/cart/cart.service';
import { take } from 'rxjs/operators';
import { Product } from 'src/app/models/product.model';
import { Cart } from 'src/app/models/cart.model';
import { Category } from 'src/app/models/category.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {

  id: any;
  data = {} as Shop;
  shops: Shop[] = [];
  orderItems: Product[] = [];
  isLoading: boolean;
  cartData = {} as Cart;
  storedData = {} as Cart;
  model = {
    icon: 'pricetags-outline',
    title: 'No Products Available'
  };
  categories: Category[] = [];
  cartSub: Subscription;
  shopItems: Product[] = [];
  
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private cartService: CartService,
    private global: GlobalService
  ) {}

  ngOnInit() {    
    this.route.paramMap.pipe(take(1)).subscribe(paramMap => {
      console.log('route data: ', paramMap);
      if(!paramMap.has('shopId')) {
        this.navCtrl.back();
        return;
      }
      this.id = paramMap.get('shopId');
      console.log('id: ', this.id);
    });
    this.cartSub = this.cartService.cart.subscribe(cart => {
      console.log('cart items: ', cart);
      this.cartData = {} as Cart;
      this.storedData = {} as Cart;
      if(cart && cart?.totalItem > 0) {
        this.storedData = cart;
        this.cartData.totalItem = this.storedData.totalItem;
        this.cartData.totalPrice = this.storedData.totalPrice;
        if(cart?.shop?.uid === this.id) {
          this.shopItems.forEach(element => {
            cart.items.forEach(element2 => {
              if(element.id != element2.id) return;
              element.quantity = element2.quantity;
            });
          });
          console.log('allitems: ', this.shopItems);
          this.cartData.items = this.shopItems.filter(x => x.quantity > 0);
        } else {
          this.shopItems.forEach(element => {            
              element.quantity = 0;
          });
         
        }
      } 
      
    });    
    this.getItems();
  }

  async getItems() {
    try {      
      this.isLoading = true;
      this.data = {} as Shop;
      this.cartData = {} as Cart;
      this.storedData = {} as Cart;
      this.data = await this.api.getShopsById(this.id);
      this.categories = await this.api.getShopCategories(this.id);
      this.shopItems = await this.api.getShopProducts(this.id);
      this.orderItems = [...this.shopItems];
      console.log('items: ', this.orderItems[0]);
      console.log('shop: ', this.data);
      await this.cartService.getCartData();
      this.isLoading = false;
      // this.shopItems.forEach((element, index) => {
        //     this.shopItems[index].quantity = 0;
        //   });
    } catch(e) {
      console.log(e);
      this.isLoading = false;
      this.global.errorToast();
    }
  }



  quantityPlus(item) {
    const index = this.shopItems.findIndex(x => x.id === item.id);
    console.log(index);
    if(!this.shopItems[index].quantity || this.shopItems[index].quantity == 0) {
      if(!this.storedData.shop || (this.storedData.shop && this.storedData.shop.uid == this.id)) {
        console.log('index item: ', this.shopItems);
        this.cartService.quantityPlus(index, this.shopItems, this.data);
      } else {
        // alert for clear cart
        this.cartService.alertClearCart(index, this.shopItems, this.data);
      }
    } else {
      this.cartService.quantityPlus(index, this.shopItems, this.data);
    }  
  }

  quantityMinus(item) {
    const index = this.shopItems.findIndex(x => x.id === item.id);
    this.cartService.quantityMinus(index, this.shopItems);
  }

  saveToCart() {
    try {
      this.cartData.shop = {} as Shop;
      this.cartData.shop = this.data;
      console.log('save cartData: ', this.cartData);
      this.cartService.saveCart();
    } catch(e) {
      console.log(e);
    }
  }

  async viewCart() {
    console.log('save cartdata: ', this.cartData);
    if(this.cartData.items && this.cartData.items.length > 0) await this.saveToCart();
    console.log('router url: ', this.router.url);
    this.router.navigate([this.router.url + '/cart']);
  }

  // checkItemCategory(id) {
  //   const item = this.orderedItems.find(x => x.category_id.id == id);
  //   if(item) return true;
  //   return false;
  // }

  async ionViewWillLeave() {
    console.log('ionViewWillLeave ItemsPage');
    if(this.cartData?.items && this.cartData?.items.length > 0) await this.saveToCart();
  }


  ngOnDestroy() {
    if(this.cartSub) this.cartSub.unsubscribe();
  }
}