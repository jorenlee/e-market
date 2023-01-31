import { Component, OnInit, Input } from '@angular/core';
import { Shop } from 'src/app/models/shop.model';
@Component({
  selector: 'app-user-shopcomponents',
  templateUrl: './user-shopcomponents.component.html',
  styleUrls: ['./user-shopcomponents.component.scss'],
})
export class UserShopcomponentsComponent implements OnInit {

// user-shopboard
  
  @Input() shop: Shop;
  constructor() { }

  ngOnInit() {}

}
