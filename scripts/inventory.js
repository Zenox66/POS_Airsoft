let products = JSON.parse(localStorage.getItem("products")) || [];

let table = document.getElementById("inventoryTable");

// DISPLAY PRODUCTS
function renderTable() {
    table.innerHTML = "";

    products.forEach((p, index) => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${p.name}</td>
            <td>
                <input value="${p.price}" onchange="updatePrice(${index}, this.value)">
            </td>
            <td>
                <input value="${p.stock}" onchange="updateStock(${index}, this.value)">
            </td>
            <td>
                <button onclick="deleteProduct(${index})">Delete</button>
            </td>
        `;

        table.appendChild(row);
    });
}

// UPDATE PRICE
function updatePrice(index, value) {
    if (!value.startsWith("$")) value = "$" + value;
    products[index].price = value;
    save();
}

// UPDATE STOCK
function updateStock(index, value) {
    products[index].stock = parseInt(value) || 0;
    save();
}

// DELETE
function deleteProduct(index) {
    if (confirm("Delete this product?")) {
        products.splice(index, 1);
        save();
        renderTable();
    }
}

// ADD PRODUCT
function addProduct() {
    let name = document.getElementById("newName").value;
    let price = document.getElementById("newPrice").value;
    let stock = parseInt(document.getElementById("newStock").value);

    if (!name || !price || isNaN(stock)) {
        alert("Fill all fields!");
        return;
    }

    products.push({
        id: Date.now(),
        name,
        price: price.startsWith("$") ? price : "$" + price,
        stock,
        category: "custom",
        image: "https://via.placeholder.com/100"
    });

    save();
    renderTable();
}

// SAVE
function save() {
    localStorage.setItem("products", JSON.stringify(products));
}

// BACK
function goBack() {
    window.location.href = "index.html";
}

// INIT
renderTable();