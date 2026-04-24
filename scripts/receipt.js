let data = JSON.parse(localStorage.getItem("receipt"));

let receiptItems = document.getElementById("receiptItems");
let subtotalEl = document.getElementById("subtotal");
let totalEl = document.getElementById("total");
let cashEl = document.getElementById("cash");
let changeEl = document.getElementById("change");
let datetimeEl = document.getElementById("datetime");

// FORMAT DATE
let now = new Date();
datetimeEl.innerText = now.toLocaleString();

// SAFETY CHECK
if (!data || !data.cart) {
    alert("No receipt data found!");
}

// GET PRICE NUMBER
function getPriceNumber(priceString) {
    return parseFloat(priceString.replace("$", ""));
}

// CALCULATE + DISPLAY ITEMS
let subtotal = 0;

data.cart.forEach(item => {
    let price = getPriceNumber(item.price);
    let itemTotal = price * item.quantity;

    subtotal += itemTotal;

    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${item.quantity}</td>
        <td>${item.name}</td>
        <td class="right">$${itemTotal.toFixed(2)}</td>
    `;

    receiptItems.appendChild(row);
});

// TOTALS
let total = subtotal;

// DISPLAY
subtotalEl.innerText = "$" + subtotal.toFixed(2);
totalEl.innerText = "$" + total.toFixed(2);
cashEl.innerText = "$" + data.cash.toFixed(2);
changeEl.innerText = "$" + data.change.toFixed(2);
