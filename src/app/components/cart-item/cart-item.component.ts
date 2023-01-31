import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/models/product.model';


@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent implements OnInit {

  fallbackImage = '';
  @Input() item: Product;
  @Input() index: any;
  @Output() add: EventEmitter<any> = new EventEmitter();
  @Output() minus: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  onImgError(event) {
    event.target.src = this.fallbackImage;
  }

  quantityPlus() {
    this.add.emit(this.index);
  }

  quantityMinus() {
    this.minus.emit(this.index);
  }
  

}
