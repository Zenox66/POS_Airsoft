// ELEMENTS
let openCartBtn = document.getElementById("openCart");
let closeCartBtn = document.getElementById("closeCart");
let cartPanel = document.getElementById("cartPanel");

let listProductHTML = document.getElementById("listProducts");
let cartItemsHTML = document.getElementById("cartItems");
let totalPriceHTML = document.getElementById("totalPrice");

let cashInput = document.getElementById("cashInput");
let changeOutput = document.getElementById("changeOutput");

cashInput.addEventListener("input", updateChange);

// DATA HANDLING
let listProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// OPEN/CLOSE CART
function openCart() {
    document.getElementById("cartPanel").style.width = "350px";
}
function closeCart() {
    document.getElementById("cartPanel").style.width = "0";
}

// RENDER ALERT BOX
function showMessage(message, type) {
    const alertBox = document.getElementById("customAlert");
    const title = alertBox.querySelector(".errorType");
    const text = alertBox.querySelector(".message");
    const confirmBtn = document.getElementById("confirmBtn");
    const background = document.getElementById("main");
    

    title.innerText = type;
    text.innerText = message;

    alertBox.style.display = "flex";
    background.style.filter = "blur(1px)"

    confirmBtn.onclick = () => {
        alertBox.style.display = "none";
        background.style.filter = "blur(0px)"
    };
}

// SAVE CART
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(listProducts));
}

// ADD TO CART
function addtoCart(category, id) {
    let product = listProducts.find(p => p.id === id && p.category === category);
    if (!product) return;

    let existing = cart.find(p => p.id === id && p.category === category);

    if (product.stock <= 0) {
        showMessage("Out of stock!", "Error");
        return;
    }

    product.stock--;

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveProducts();
    saveCart();
    addDataToHTML();
    renderCart();
}

// REMOVE
function removeCart(id, category) {
    let item = cart.find(p => p.id === id && p.category === category);

    if (item) {
        let product = listProducts.find(p => p.id === id && p.category === category);
        if (product) product.stock += item.quantity;
    }

    cart = cart.filter(p => !(p.id === id && p.category === category));
    saveProducts();
    saveCart();
    addDataToHTML();
    renderCart();
}

// DISPLAY PRODUCTS
function addDataToHTML() {
    listProductHTML.innerHTML = '';

    listProducts.forEach(product => {
        let div = document.createElement('div');
        div.classList.add('item');

        div.innerHTML = `
            <img src="${product.image}" width="100">
            <h3>${product.name}</h3>
            <p>Stock: ${product.stock}</p>
            <p>₱${product.price.toFixed(2)}</p>
            <button>Add</button>
        `;

        div.querySelector("button")
            .addEventListener("click", () => addtoCart(product.category, product.id));
        let button = div.querySelector("button");

        if (product.stock <= 0) {
            button.disabled = true;
            button.innerText = "Out of Stock";
        }

        listProductHTML.appendChild(div);
    });
}

// DISPLAY CART
function renderCart() {
    cartItemsHTML.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        let price = item.price;
        total += price * item.quantity;

        let div = document.createElement("div");

        div.innerHTML = `
            <p>${item.name}</p>
            <p>₱${price.toFixed(2)} x ${item.quantity}</p>
            <button class="minus">-</button>
            <button class="plus">+</button>
            <button class="remove">Remove</button>
        `;

        div.querySelector(".minus").onclick = () => {
        item.quantity--;
    
        let product = listProducts.find(p => p.id === item.id && p.category === item.category);
        if (product) product.stock++;

        if (item.quantity <= 0) {
            removeCart(item.id, item.category);
        } else {
            saveProducts();
            saveCart();
            addDataToHTML();
            renderCart();
            }
        };

        div.querySelector(".plus").onclick = () => {
            let product = listProducts.find(p => p.id === item.id && p.category === item.category);

            if (!product || product.stock <= 0) {
                showMessage("No more stock available!", "Error");
                return;
            }

            product.stock++;
            item.quantity++;
            product.stock--;

            saveProducts();
            saveCart();
            addDataToHTML();
            renderCart();
        };

        div.querySelector(".remove").onclick = () => {
            removeCart(item.id, item.category);
        };

        cartItemsHTML.appendChild(div);
    });

    totalPriceHTML.innerText = "Total: ₱" + total.toFixed(2);

    updateChange();
}

// UPDATE CHANGE
function updateChange() {
    let cash = parseFloat(cashInput.value);

    let total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    if (isNaN(cash)) {
        changeOutput.innerText = "Change: ₱0.00";
        return;
    }

    let change = cash - total;

    changeOutput.innerText = "Change: ₱" + change.toFixed(2);
}

// CHECKOUT
document.getElementById("checkoutBtn").onclick = () => {
    let cash = parseFloat(cashInput.value);

    if (cart.length === 0) {
        showMessage("Cart is empty!", "Error");
        return;
    }

    let total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    if (isNaN(cash) || cash < total) {
        showMessage("Insufficient cash!", "Error");
        return;
    }

    let change = cash - total;

    localStorage.setItem("receipt", JSON.stringify({
        cart: [...cart],
        total,
        cash,
        change
    }));

    cart = [];
    saveCart();
    saveProducts();
    addDataToHTML();
    renderCart();

    window.open("../receipt.html", "_blank");
};

// LOAD ALL JSON FILES
const initStore = async () => {
    let storedProducts = localStorage.getItem("products");

    if (storedProducts) {
        listProducts = JSON.parse(storedProducts);
    } else {
        const files = [
            { path: "scripts/data/product_airsoft_accessory.json", category: "accessory" },
            { path: "scripts/data/product_airsoft_gear.json", category: "gear" },
            { path: "scripts/data/product_airsoft_pistol.json", category: "pistol" },
            { path: "scripts/data/product_airsoft_rifle.json", category: "rifle" }
        ];

        let allProducts = [];

        for (let file of files) {
            let res = await fetch(file.path);
            let data = await res.json();

            let withCategory = data.map(p => ({
                ...p,
                category: file.category
            }));

            allProducts = [...allProducts, ...withCategory];
        }

        listProducts = allProducts;

        localStorage.setItem("products", JSON.stringify(listProducts));
    }

    addDataToHTML();
    renderCart();
};

initStore();