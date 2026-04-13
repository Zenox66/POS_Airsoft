let data = JSON.parse(localStorage.getItem("receipt"));

let receiptItems = document.getElementById("receiptItems");

let subtotalEl = document.getElementById("subtotal");
let taxEl = document.getElementById("tax");
let totalEl = document.getElementById("total");
let cashEl = document.getElementById("cash");
let changeEl = document.getElementById("change");
let datetimeEl = document.getElementById("datetime");

function getPriceNumber(priceString) {
    return parseFloat(priceString.replace("$", ""));
}

// DATE & TIME
let now = new Date();
datetimeEl.innerText = now.toLocaleString();

// ITEMS
let subtotal = 0;

data.cart.forEach(item => {
    let price = getPriceNumber(item.price);
    let itemTotal = price * item.quantity;
    subtotal += itemTotal;

    let div = document.createElement("div");

    div.innerHTML = `
        <div class="row">
            <span>${item.quantity} ${item.name}</span>
            <span>$${itemTotal.toFixed(2)}</span>
        </div>
    `;

    receiptItems.appendChild(div);
});

let total = subtotal;

// DISPLAY
subtotalEl.innerText = "$" + subtotal.toFixed(2);
totalEl.innerText = "$" + total.toFixed(2);
cashEl.innerText = "$" + data.cash.toFixed(2);
changeEl.innerText = "$" + data.change.toFixed(2);