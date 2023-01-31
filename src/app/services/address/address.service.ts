import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Address } from 'src/app/models/address.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  uid: string;

  private _addresses = new BehaviorSubject<Address[]>([]);
  private _addressChange = new BehaviorSubject<Address>(null);

  get addresses() {
    return this._addresses.asObservable();
  }
  get addressChange() {
    return this._addressChange.asObservable();
  }

  constructor(
    private api: ApiService,
    private auth: AuthService
    ) { }

    async getUid() {
      return await this.auth.getId();
    }
  
    async getAddressRef(query?) {
      // getting id from getUid
      if(!this.uid) this.uid = await this.getUid();
      return await this.api.collection('address').doc(this.uid).collection('all', query);
    }
  
    async getAddresses(limit?) {
      try {
        let addressRef;
        if(limit) addressRef = await this.getAddressRef(ref => ref.limit(limit));
        else addressRef = await this.getAddressRef();
        const allAddress: Address[] = await addressRef.get().pipe(
          switchMap(async(data: any) => {
            let itemData = await data.docs.map(element => {
              let item = element.data();
              item.id = element.id;
              return item;
            });
            console.log(itemData);
            return itemData;
          })
        )
        .toPromise(); 
        console.log(allAddress);
        this._addresses.next(allAddress);
      } catch(e) {
        console.log(e);
        throw(e);
      }
    }
  
    async addAddress(param) {
      try {      
        const currentAddresses = this._addresses.value;
        const data = new Address(
          // getting uid from getUid
          this.uid ? this.uid : await this.getUid(),
          param.title,
          param.landmark,
          param.house,
        );
        let addressData = Object.assign({}, data);
        delete addressData.id;
        const response = await (await this.getAddressRef()).add(addressData);
        console.log(response);
        const id = await response.id;
        const address = {...addressData, id};
        currentAddresses.push(address);
        this._addresses.next(currentAddresses);
        this._addressChange.next(address);
      } catch(e) {
        throw(e);
      }
    }
  
    async updateAddress(id, param) {
      try {
        await (await this.getAddressRef()).doc(id).update(param);
        let currentAddresses = this._addresses.value;
        const index = currentAddresses.findIndex(x => x.id == id);
        const data = new Address(
          param.user_id,
          param.title,
          param.landmark,
          param.house,
          id,
        );
        currentAddresses[index] = data;
        this._addresses.next(currentAddresses);
        this._addressChange.next(data);
      } catch(e) {
        throw(e);
      }
    }
  
    async deleteAddress(param) {
      try {
        await (await this.getAddressRef()).doc(param.id).delete();
        let currentAddresses = this._addresses.value;
        currentAddresses = currentAddresses.filter(x => x.id != param.id);
        this._addresses.next(currentAddresses);
      } catch(e) {
        throw(e);
      }
    }
  
    changeAddress(address) {
      this._addressChange.next(address);
    }
}
