import { Component, Input, OnInit } from '@angular/core';
import { Shop } from 'src/app/models/shop.model';

@Component({
  selector: 'app-emarket',
  templateUrl: './emarket.component.html',
  styleUrls: ['./emarket.component.scss'],
})
export class EmarketComponent implements OnInit {
  
  @Input() shop: Shop;
  constructor() { }

  ngOnInit() {}

}
