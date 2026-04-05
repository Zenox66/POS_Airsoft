let openCartBtn = document.getElementById("addtoCart");
let closeCartBtn = document.getElementById("close");
let cartPanel = document.getElementById("cartPanel");

let listProductHTML = document.getElementById("listProducts");
let cartItemsHTML = document.getElementById("cartItems");
let totalPriceHTML = document.getElementById("totalPrice");

let listProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

openCartBtn.onclick = () => cartPanel.classList.add("active");
closeCartBtn.onclick = () => cartPanel.classList.remove("active");

// ADD TO CART
function addtoCart(category, id) {
    let product = listProducts.find(p => p.id === id);

    if (!product) return;

    let existing = cart.find(p => p.id === id && p.category === category);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, category, quantity: 1 });
    }

    saveCart();
    renderCart();
}

// REMOVE ITEM
function removeCart(id, category) {
    cart = cart.filter(p => !(p.id === id && p.category === category));
    saveCart();
    renderCart();
}

// SAVE CART
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// DISPLAY PRODUCTS
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';

    listProducts.forEach(product => {
        let newProduct = document.createElement('div');
        newProduct.classList.add('item');

        newProduct.innerHTML = `
            <img src="${product.image}" width="100">
            <h2>${product.name}</h2>
            <p>${product.price}</p>
            <button>Add to Cart</button>
        `;
        newProduct.querySelector("button")
            .addEventListener("click", () => addtoCart("airRifle", product.id));
        listProductHTML.appendChild(newProduct);
    });
}

// DISPLAY CART
function renderCart() {
    cartItemsHTML.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        let price = parseFloat(item.price.replace("$", ""));
        total += price * item.quantity;

        let div = document.createElement("div");
        div.innerHTML = `
            <p>${item.name}</p>
            <p>${item.quantity} x $${price}</p>
            <button>Remove</button>
        `;

        div.querySelector("button")
            .addEventListener("click", () => removeCart(item.id, item.category));

        cartItemsHTML.appendChild(div);
    });

    totalPriceHTML.innerText = "Total: $" + total.toFixed(2);
}

// CHECKOUT
document.getElementById("checkoutBtn").onclick = () => {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    alert("Checkout successful! (Demo only)");

    cart = [];
    saveCart();
    renderCart();
}

// LOAD DATA
const initStore = () => {
    fetch("data/product_airRifle.json")
        .then(res => res.json())
        .then(data => {
            listProducts = data;
            addDataToHTML();
            renderCart(); // load saved cart
        });
}

initStore();