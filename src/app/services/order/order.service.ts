import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  uid: string;
  private _orders = new BehaviorSubject<Order[]>([]);

  get orders() {
    return this._orders.asObservable();
  }

  constructor(
    private api: ApiService,
    private auth: AuthService
    ) { }


  async getUid() {
    if(!this.uid) return await this.auth.getId();
    else return this.uid;
  }

  async getOrderRef() {
    this.uid = await this.getUid();
    return this.api.collection('orders').doc(this.uid).collection('all');
  }

  async placeOrder(param) {
    try {
      let data = {...param};
      data.order = JSON.stringify(param.order);
      const uid = await this.getUid();
      data.shop = await this.api.firestore.collection('Shops').doc(param.shop_id);
      const orderRef = await (await this.getOrderRef()).add(data);
      const order_id = await orderRef.id;
      console.log('latest order: ', param);
      let currentOrders: Order[] = [];
      currentOrders.push(new Order(
        param.address,
        param.shop,
        param.shop_id,
        param.order,
        param.total,
        param.grandTotal,
        param.deliveryCharge,
        param.status,
        param.time,
        param.paid,    
        order_id,
        uid,
        param.instruction    
      ));
      console.log('latest order: ', currentOrders);
      currentOrders = currentOrders.concat(this._orders.value);
      console.log('orders: ', currentOrders);
      this._orders.next(currentOrders);
    } catch(e) {
      throw(e);
    }
  }

  async getOrders() {
    try {
      const orders: Order[] = await (await this.getOrderRef()).get().pipe(
        switchMap(async(data: any) => {
          let itemData = await data.docs.map(element => {
            let item = element.data();
            item.id = element.id;
            item.order = JSON.parse(item.order);
            item.shop.get()
            .then(sData => {
              item.shop = sData.data();
            })
            .catch(e => { throw(e); });
            return item;
          });
          console.log(itemData);
          return itemData;
        })
      )
      .toPromise(); 
      console.log('orders', orders);
      this._orders.next(orders);
    } catch(e) {
      throw(e);
    }
  }

}
