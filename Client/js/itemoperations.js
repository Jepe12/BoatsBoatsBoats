const itemOperations = {
    items:[],
    add(itemObject){
        /* adds an item into the array items*/
        this.items.push(itemObject)
    },
    remove(){
        /* removes the item which has the "isMarked" field set to true*/
        this.items = this.items.filter((item) => !item.isMarked)
    },
    replace(newItem){
        /* removes the item which has the "isMarked" field set to true*/
        const index = this.items.findIndex((item) => item.id == newItem.id)
        if (index == null) {
            console.warn('Attempted to replace non existant item. Adding instead.')
            this.add(newItem);
        } else {
            this.items[index] = newItem
        }
    },
    search(id){
        return this.items.find((v) => v.id == id.toString())
    },
    markUnMark(id){
        /* toggle the isMarked field of the item with the given argument id*/
        let item = this.search(id)
        if (item) {
            item.isMarked = !item.isMarked;
        } else {
            console.warn('Tried to toggle mark on item that doesn\'t exist. Id: ' + id)
        }
    },
    countTotalMarked(){
        /* counts the total number of marked items */
        return this.items.filter((item) => item.isMarked).length
    },
    countTotal() {
     return this.items.length
    },
    getItems() {
     return this.items
    },
    setItems(items) {
     this.items = items
    }
}