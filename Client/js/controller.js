window.addEventListener("load",init);
function init(){
    
    clearAll();
    loadId();
    showTotal();
    bindEvents();

    createSaveButtons();
}

function createButton(name, callback) {
    const container = document.querySelector('#add').parentElement;

    let button = document.createElement('button');
    button.textContent = name;
    button.onclick = callback;
    button.type = 'button';
    button.className = 'btn btn-info';
    container.appendChild(button);
}

function createSaveButtons() {
    createButton('Save To Local Storage', saveToLocal)
    createButton('Load From Local Storage', loadFromLocal)

    createButton('Save To Server', saveToServer)
    createButton('Load From Server', loadFromServer)
}

function saveToLocal() {
    localStorage.setItem('items', JSON.stringify(itemOperations.getItems()))
}

function loadFromLocal() {
    if (!localStorage.getItem('items')) {
        alert('no saved data');
        return;
    }
    itemOperations.setItems(JSON.parse(localStorage.getItem('items')))
    printTable(itemOperations.getItems())

    // Get the maximum id used, then ensure we're generating new id's larger
    let maxId = itemOperations.items.map((v) => parseInt(v.id)).reduce((a, b) => Math.max(a, b));
    auto = autoGen(maxId + 1)
    loadId();
}

async function saveToServer(e) {
    await fetch('http://127.0.0.1:3000/json/set', { 
        method: 'PUT',
        body: JSON.stringify(itemOperations.getItems()),
        headers: {
            "Content-Type": "application/json",
        }
    })
    alert('Saved Successfully')
}

let auto = autoGen();

async function loadFromServer() {
    let data = await fetch('http://127.0.0.1:3000/json/get')
    itemOperations.setItems(await data.json())
    printTable(itemOperations.getItems())

    // Get the maximum id used, then ensure we're generating new id's larger
    let maxId = itemOperations.items.map((v) => parseInt(v.id)).reduce((a, b) => Math.max(a, b));
    auto = autoGen(maxId + 1)
    loadId();

    return false;
}

function clearAll(){

    /* this function clears the contents of the form except the ID (since ID is auto generated)*/
    document.querySelector('#name').value = 'name' + Math.random().toString().substring(3,6)
    document.querySelector('#price').value = Math.random() * 100 + ''
    document.querySelector('#desc').value = ''
    document.querySelector('#color').value = ''
    document.querySelector('#url').value = ''
}

function loadId(){
    /* this function automatically sets the value of ID */
    document.querySelector('#id').innerText = auto.next().value;
    

}

function showTotal(){
    /* this function populates the values of #total, #mark and #unmark ids of the form */
    const marked = itemOperations.countTotalMarked();
    const total = itemOperations.countTotal();
    document.querySelector('#mark').textContent = marked;
    document.querySelector('#unmark').textContent = total - marked;
    document.querySelector('#total').textContent = total;
    
}

function bindEvents(){
    
    document.querySelector('#remove').addEventListener('click',deleteRecords);
    document.querySelector('#add').addEventListener('click',addRecord);
    document.querySelector('#update').addEventListener('click',updateRecord)
    document.querySelector('#exchange').addEventListener('change',getExchangerate)
}

function deleteRecords(){
    /* this function deletes the selected record from itemOperations and prints the table using the function printTable*/
    itemOperations.remove();

    printTable(itemOperations.getItems());
}

function getFormItem() {
    return new Item(
        document.querySelector('#id').textContent,
        document.querySelector('#name').value,
        document.querySelector('#price').value,
        document.querySelector('#desc').value,
        document.querySelector('#color').value,
        document.querySelector('#url').value
    )
}

function addRecord(){
    /* this function adds a new record in itemOperations and then calls printRecord(). showTotal(), loadId() and clearAll()*/

    const formItem = getFormItem();

    itemOperations.add(formItem);

    printRecord(formItem);

    showTotal();

    loadId();

    clearAll();
}

function edit(id){
    /*this function fills (calls fillFields()) the form with the values of the item to edit after searching it in items */ 
    let editid = this.getAttribute('data-itemid');

    let item = itemOperations.search(editid);

    fillFields(item);
}

function fillFields(itemObject){
    /*this function fills the form with the details of itemObject*/
    document.querySelector('#id').textContent = itemObject.id
    document.querySelector('#name').value = itemObject.name
    document.querySelector('#price').value = itemObject.price
    document.querySelector('#desc').value = itemObject.desc
    document.querySelector('#color').value = itemObject.color
    document.querySelector('#url').value = itemObject.url
}

function createIcon(className,fn, id){
 /* this function creates icons for edit and trash for each record in the table*/
    // <i class="fas fa-trash"></i>
    // <i class="fas fa-edit"></i>
    var iTag = document.createElement("i");
    iTag.className = className;
    iTag.addEventListener('click',fn);
    iTag.setAttribute("data-itemid", id) ;

    return iTag;
}


function updateRecord(){
    /*this function updates the record that is edited and then prints the table using printTable()*/
    
    const formItem = getFormItem();

    itemOperations.replace(formItem)

    printTable(itemOperations.getItems())

    clearAll()
}

function trash(){
    /*this function toggles the color of the row when its trash button is selected and updates the marked and unmarked fields */
    let id = this.getAttribute('data-itemid');
    itemOperations.markUnMark(id);
    showTotal();
    let tr = this.parentNode.parentNode;
    tr.classList.toggle('alert-danger');
    console.log("I am Trash ",this.getAttribute('data-itemid'))
}

function printTable(items){
    /* this function calls printRecord for each item of items and then calls the showTotal function*/

    // Delete all children
    document.querySelector('#items').innerHTML = ''
    
    // Loop through and add children back
    for (let item of items) {
        printRecord(item);
    }
    
    showTotal();
}

function printRecord(item){
    var tbody = document.querySelector('#items');
    var tr = tbody.insertRow();
    var index = 0;
    for(let key in item){
        if(key=='isMarked'){
            continue;
        }
        let cell = tr.insertCell(index);
        cell.innerText = item[key] ;
        index++;
    }
    var lastTD = tr.insertCell(index);-
    lastTD.appendChild(createIcon('fas fa-trash mr-2',trash,item.id));
    lastTD.appendChild(createIcon('fas fa-edit',edit,item.id));
}

async function getExchangerate() {
    document.querySelector('#exrate').value = 'Loading...'
    /* this function makes an AJAX call to http://apilayer.net/api/live to fetch and display the exchange rate for the currency selected*/
    const request = await fetch('https://api.apilayer.com/exchangerates_data/latest?base=USD&symbols=' + this.value,  {
        headers: {
            "apiKey": "n3Fn9Zc7URbypJcOzLSd2JUIT6YDWg2T"
        }
    })
    const json = await request.json();
    const currentPrice = document.querySelector('#price').value;
    document.querySelector('#exrate').value = json.rates[this.value] * currentPrice
}