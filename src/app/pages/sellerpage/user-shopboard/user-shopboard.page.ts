import { Component, OnInit } from '@angular/core';
import { Shop } from 'src/app/models/shop.model';
import { ApiService } from 'src/app/services/api/api.service';
import {StorageService} from 'src/app/services/storage/storage.service'

@Component({
  selector: 'app-user-shopboard',
  templateUrl: './user-shopboard.page.html',
  styleUrls: ['./user-shopboard.page.scss'],
})
export class UserShopboardPage implements OnInit {

  shops: Shop[] = [];
  constructor(
    private api: ApiService,
    private storage:StorageService
  ) { }
email = "";
  ngOnInit() {
    
        this.storage.getStorage("profile").then((res:any)=>{
        let res1 = JSON.parse(res.value);
        this.email = res1.email;
        this.getEMarket();
      })
      
    
  }

  getEMarket() {
    this.api
      .getEMarket()
      .then((data) => {
        console.log(this.email);
        this.shops = [];
        data.forEach(element => {
          console.log(element);
          if(element.email == this.email)
          {
            this.shops.push(element);
          }
        });
       console.log(this.shops)
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
