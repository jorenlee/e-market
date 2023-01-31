import { Component, OnInit } from '@angular/core';
import { Shop } from 'src/app/models/shop.model';

@Component({
  selector: 'app-sellerpage',
  templateUrl: './sellerpage.page.html',
  styleUrls: ['./sellerpage.page.scss'],
})
export class SellerpagePage implements OnInit {
  shops: Shop[] = [];
  constructor() { }

  ngOnInit() {
  }

}
