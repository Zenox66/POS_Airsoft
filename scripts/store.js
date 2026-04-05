let addCart = document.getElementById("addtoCart");
let closeCart = document.getElementById(".close");

let listProducts = [];

function addProducts() {

}

function removeProducts() {}

function updateProducts() {}

const addDataToHTML = (products) => {
    listProductHTML.innerHTML = '';
    if (listProducts.length > 0) {
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.innerHTML = '';
            listProductHTML.appendChild(newProduct);
        })
    }
}

const initStore = () => {
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            listProducts = data;
            console.log(listProducts);
            addDataToHTML(listProducts);
        })
    .catch(error => console.error("Error loading products:", error));
}
initStore();