import { Address } from "./address.model";
import { Product } from "./product.model";
import { Shop } from "./shop.model";
// import { Item } from "./item.model";
// import { Restaurant } from "./restaurant.model";

export class Cart {
    constructor(
        public shop: Shop,
        public items: Product[],
        public totalItem?: number,
        public totalPrice?: number,
        public grandTotal?: number,
        public location?: Address,
        public deliveryCharge?: number
    ) {}
}