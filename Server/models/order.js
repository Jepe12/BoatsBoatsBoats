class Order {
    constructor(products /** type ProductOrder[] */, total /** type float */) {
        this.products = products;
        this.total = total; // Total price
    }
}

class ProductOrder {
    constructor(product /** type Boat */, id, quantity) {
        this.product = product;
        this.id = id; // ID at time of creation
        this.quantity = quantity;
    }
}