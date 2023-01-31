import { Component, OnInit, Input } from '@angular/core';
import { Shop } from 'src/app/models/shop.model';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.scss'],
})
export class ShopDetailsComponent implements OnInit {

  @Input() data: Shop;
  // @Input() shop: Shop;
  @Input() isLoading;
  constructor() { }

  ngOnInit() {}



}
