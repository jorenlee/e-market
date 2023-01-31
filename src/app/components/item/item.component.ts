import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {

  fallbackImage = '';
  @Input() item: Product;
  @Input() index;
  @Output() add: EventEmitter<Product> = new EventEmitter();
  @Output() minus: EventEmitter<Product> = new EventEmitter();

  constructor() { }

  ngOnInit() {}
  
  onImgError(event) {
    event.target.src = this.fallbackImage;
  }

  quantityPlus() {
    this.add.emit(this.item);
  }

  quantityMinus() {
    this.minus.emit(this.item);
  }

}
