class Order {
    constructor(products /** type ProductOrder[] */) {
        this.products = products;
    }
}

class ProductOrder {
    constructor(product /** type Boat */, amount) {
        this.product = product;
        this.amount = amount;
    }
}