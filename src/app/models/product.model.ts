export class Product {
    
    constructor(
        public id: string,
        public shop_id: string,
        public category_id: any,
        // public uid: string,
        public cover: string,
        public product_name: string,
        public description: string,
        public price: number,
        public status: boolean,
        // public variation: boolean,
        // public rating: number,
        public quantity?: number
    ) {}

}