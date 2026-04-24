let products = JSON.parse(localStorage.getItem("products")) || [];

let table = document.getElementById("inventoryTable");

async function initializeProducts() {
    let stored = localStorage.getItem("products");

    if (!stored) {
        try {
            const files = [
                "scripts/data/product_airsoft_accessory.json",
                "scripts/data/product_airsoft_gear.json",
                "scripts/data/product_airsoft_pistol.json",
                "scripts/data/product_airsoft_rifle.json"
            ];
            
            let results = await Promise.all(
                files.map(file => fetch(file).then(res => {
                    console.log(file, res.status);
                    if (!res.ok) throw new Error(file + " not found");
                    return res.json();
                }))
            );
            
            products = results.flat().map((p, index) => ({
                ...p,
                id: Date.now() + index
            }));

            localStorage.setItem("products", JSON.stringify(products));

            console.log("Loaded all JSON files:", products);

        } catch (err) {
            console.error("Error loading JSON files:", err);
            alert("Check your JSON paths or server.");
            products = [];
        }
    } else {
        products = JSON.parse(stored);
    }

    renderTable();
}

// DISPLAY PRODUCTS
function renderTable() {
    table.innerHTML = "";

    products.forEach((p, index) => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${p.name}</td>
            <td>
                <input value="${p.price}" type="number" step="0.01"
                onchange="updatePrice(${index}, this.value)">
            </td>
            <td>
                <input value="${p.stock}" 
                onchange="updateStock(${index}, this.value)">
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
    products[index].price = parseFloat(value) || 0;
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
        price: parseFloat(price) || 0,
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
    window.location.href = "admin.html";
}

// INIT
initializeProducts();