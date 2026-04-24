const registerForm = document.getElementById("register_form");
const loginForm = document.getElementById("login_form");
const employee_RegistrationForm = document.getElementById("register_form_employee");

const logoutBtns = document.querySelectorAll(".logoutBtn");

logoutBtns.forEach(btn => {
    btn.addEventListener("click", function(e) {
        e.preventDefault();
        logOut();
        window.location.href = "index.html";
    });
});

if (registerForm) {
    registerForm.addEventListener("submit", function(event){
        event.preventDefault();
        registerCustomer();
    });
}

if (employee_RegistrationForm) {
    employee_RegistrationForm.addEventListener("submit", function(event){
        event.preventDefault();
        registerEmployee();
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", function(event){
        event.preventDefault();
        login();
    });
}

class User {
    constructor(username, password, role){
        this.username = username;
        this.password = password;
        this.role = role;
    }
}

class Cashier extends User {
    constructor(username, password){
        super(username, password, "cashier");
    }
}

class Customer extends User {
    constructor(username, password){
        super(username, password, "customer");
    }
}

function getUsers(){
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users){
    localStorage.setItem("users", JSON.stringify(users));
}

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

// ADMIN CHECK
function isAdmin(username, password){
    return username === "admin" && password === "123";
}

// HARDCODED USERS TEMP BEFORE SQL
function isEmployee(username, password) {
    return (
        (username === "Neil" && password === "1423") ||
        (username === "Rafael" && password === "4123") ||
        (username === "Kurt" && password === "2314")
    );
}

//Show Password
function showPassword() {
  var x = document.getElementById("password_input");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

// REGISTER FUNCTION
function registerEmployee(){
    const username = document.getElementById("username_input")?.value.trim();
    const password = document.getElementById("password_input")?.value;
    const confirmPassword = document.getElementById("password_Confirmation")?.value;

    if (verifyEmployeeRegistration(username, password, confirmPassword)) {
        showMessage("Employee registration successful!", "Success");
    }
}

function registerCustomer(){
    const username = document.getElementById("username_input")?.value.trim();
    const password = document.getElementById("password_input")?.value;
    const confirmPassword = document.getElementById("password_Confirmation")?.value;

    if (verifyRegistration(username, password, confirmPassword)) {
        showMessage("Registration successful!", "Success");
    }
}


// REGISTRATION VALIDATION
function verifyEmployeeRegistration(username, password, confirmPassword){

    if (!username || !password || !confirmPassword) {
        showMessage("All fields are required", "Error");
        return false;
    }
    if (password !== confirmPassword) {
        showMessage("Passwords do not match", "Error");
        return false;
    }
    if (password.length < 6) {
        showMessage("Password must be at least 6 characters", "Error");
        return false;
    }
    let users = getUsers();

    if (users.some(user => user.username === username)) {
        showMessage("Username already exists", "Error");
        return false;
    }
    // Create new employee
    let newEmployee = new Cashier(username, password);
    users.push(newEmployee);
    saveUsers(users);
    setTimeout(() => {
        window.location.href = "../index.html";
    }, 1000);
    return true;
}

function verifyRegistration(username, password, confirmPassword){

    if (!username || !password || !confirmPassword) {
        showMessage("All fields are required", "Error");
        return false;
    }
    if (password !== confirmPassword) {
        showMessage("Passwords do not match", "Error");
        return false;
    }
    if (password.length < 6) {
        showMessage("Password must be at least 6 characters", "Error");
        return false;
    }
    let users = getUsers();

    if (users.some(user => user.username === username)) {
        showMessage("Username already exists", "Error");
        return false;
    }

    // Create new user
    let newUser = new Customer(username, password);
    users.push(newUser);
    saveUsers(users);
    setTimeout(() => {
        window.location.href = "../login.html";
    }, 1000);
    return true;
}

// LOGIN FUNCTION
function login(){
    const username = document.getElementById("username_input")?.value.trim();
    const password = document.getElementById("password_input")?.value;

    if (!username || !password) {
        showMessage("Please enter username and password", "Error");
        return;
    }

    verifyLogin(username, password);
}

// LOGIN VALIDATION
function verifyLogin(username, password){

    // Admin login
    if (isAdmin(username, password)) {
        localStorage.setItem("currentUser", "admin");
        timeIn("admin");
        showMessage("Welcome Admin!", "Success");

        setTimeout(() => {
            window.location.href = "admin.html";
        }, 1000);

        return;
    }

    if (isEmployee(username, password)) {
        localStorage.setItem("currentUser", username);
        timeIn(username);

        showMessage("Welcome Employee!", "Success");

        setTimeout(() => {
            window.location.href = "cashier.html";
        }, 1000);

        return;
    }

    let users = getUsers();
    let foundUser = users.find(user => user.username === username && user.password === password);

    if (!foundUser) {
        showMessage("Invalid username or password", "Error");
        return;
    }

    // Save logged-in user
    localStorage.setItem("currentUser", foundUser.username);
    timeIn(foundUser.username);
    showMessage("Login successful!", "Success");
    // Role-based redirect
    setTimeout(() => {
        if (foundUser.role === "cashier") {
            window.location.href = "cashier.html";
        } else {
            window.location.href = "store.html";
        }
    }, 1000);
}

function timeIn(username){
    let logs = getLogs();
    let alreadyLogged = logs.find(log => log.username === username && log.timeOut === null);

    if (alreadyLogged) return; // prevent duplicate

    logs.push({
        username: username,
        timeIn: new Date().toISOString(),
        timeOut: null
    });

    saveLogs(logs);
}

function timeOut(username){
    let logs = getLogs();
    for (let i = logs.length - 1; i >= 0; i--) {
        if (logs[i].username === username && logs[i].timeOut === null) {
            logs[i].timeOut = new Date().toISOString();
            break;
        }
    }
    saveLogs(logs);
}

function getLogs(){
    return JSON.parse(localStorage.getItem("logs")) || [];
}

function saveLogs(logs){
    localStorage.setItem("logs", JSON.stringify(logs));
}

///Log Out
function logOut(){
    let currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
        timeOut(currentUser);
    }

    localStorage.removeItem("currentUser");
}