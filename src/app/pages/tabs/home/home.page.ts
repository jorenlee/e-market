import { Component, OnInit } from "@angular/core";
import { Shop } from "src/app/models/shop.model";
import { ApiService } from "src/app/services/api/api.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {

  isLoading: boolean = false;
  shops: Shop[] = [];
  banners: any[] = [];
  // emarket: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.isLoading = true;
    this.getBanners();
    this.getEMarket();
    this.isLoading = false;
  }

//  this.isLoading = true;
//   this.global.showLoader();
//   setTimeout(async() => {
//     this.getBanners();
//     console.log(this.getBanners);
//      this.getEMarket();
//      console.log(this.getEMarket);
//      this.isLoading = false;
//      this.global.hideLoader();
//   }, 3000);

  // getting banners and shops/emarket
  getBanners() {
    this.api
      .getBanners()
      .then((data) => {
        console.log(data);
        this.banners = data;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getEMarket() {
    this.api
      .getEMarket()
      .then((data) => {
        console.log(data);
        this.shops = data;
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
