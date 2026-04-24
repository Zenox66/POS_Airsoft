// =====================
// STORAGE
// =====================
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// =====================
// ALERT
// =====================
function showMessage(message, type) {
    const alertBox = document.getElementById("customAlert");
    const title = alertBox.querySelector(".errorType");
    const text = alertBox.querySelector(".message");
    const confirmBtn = document.getElementById("confirmBtn");

    title.innerText = type;
    text.innerText = message;

    alertBox.style.display = "flex";

    confirmBtn.onclick = () => {
        alertBox.style.display = "none";
    };
}

// =====================
// CLASS
// =====================
class User {
    constructor(username, password, role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }
}

class Cashier extends User {
    constructor(username, password) {
        super(username, password, "cashier");
    }
}

// =====================
// GET EMPLOYEES
// =====================
function getEmployees() {
    return getUsers().filter(user => user.role === "cashier");
}

// =====================
// ADD EMPLOYEE
// =====================
function addEmployee(username, password) {
    let users = getUsers();

    if (!username || !password) {
        showMessage("All fields are required", "Error");
        return;
    }

    if (users.some(u => u.username === username)) {
        showMessage("Employee already exists", "Error");
        return;
    }

    users.push(new Cashier(username, password));
    saveUsers(users);

    showMessage("Employee added successfully!", "Success");
}

// UI ADD WRAPPER
function addEmployeeUI() {
    let username = document.getElementById("empUsername").value.trim();
    let password = document.getElementById("empPassword").value;

    addEmployee(username, password);

    renderTable();
}

// =====================
// DELETE EMPLOYEE
// =====================
function deleteEmployee(username) {
    let users = getUsers();

    let filtered = users.filter(user => user.username !== username);

    if (users.length === filtered.length) {
        showMessage("Employee not found", "Error");
        return;
    }

    saveUsers(filtered);
    showMessage("Employee deleted successfully!", "Success");

    renderTable();
}

// =====================
// EDIT EMPLOYEE
// =====================
function editEmployee(username) {
    let users = getUsers();
    let user = users.find(u => u.username === username);

    if (!user) return;

    document.getElementById("editModal").style.display = "block";
    document.getElementById("editOldUsername").value = user.username;
    document.getElementById("editUsername").value = user.username;
    document.getElementById("editPassword").value = user.password;
}

// SAVE EDIT
function saveEdit() {
    let oldUsername = document.getElementById("editOldUsername").value;
    let newUsername = document.getElementById("editUsername").value.trim();
    let newPassword = document.getElementById("editPassword").value;

    let users = getUsers();

    let user = users.find(u => u.username === oldUsername);

    if (!user) return;

    user.username = newUsername;
    user.password = newPassword;

    saveUsers(users);

    closeEdit();
    showMessage("Employee updated!", "Success");

    renderTable();
}

// CLOSE MODAL
function closeEdit() {
    document.getElementById("editModal").style.display = "none";
}

// =====================
// RENDER TABLE
// =====================
function renderTable() {
    let table = document.getElementById("employeeTable");
    let employees = getEmployees();

    table.innerHTML = "";

    employees.forEach(emp => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${emp.username}</td>
            <td>${emp.password}</td>
            <td>${emp.role}</td>
            <td>
                <button onclick="editEmployee('${emp.username}')">Edit</button>
                <button onclick="deleteEmployee('${emp.username}')">Delete</button>
            </td>
        `;

        table.appendChild(row);
    });
}

// =====================
// INIT
// =====================
renderTable();