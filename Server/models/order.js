class Order {
    constructor(products /** type ProductOrder[] */, total /** type float */, time /** type Date */, userId /** type userId */) {
        this.products = products;
        this.total = total; // Total price
        this.time = time;
        this.userId = userId;
    }
}

class ProductOrder {
    constructor(product /** type Boat */, id, quantity) {
        this.product = product;
        this.id = id; // ID at time of creation
        this.quantity = quantity;
    }
}