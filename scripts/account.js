const registerForm = document.getElementById("register_form");
const loginForm = document.getElementById("login_form");
const employee_RegistrationForm = document.getElementById("register_form_employee");

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
function showMessage(msg, color = "red"){
    const msgElement = document.getElementById("message");

    if (msgElement) {
        msgElement.innerText = msg;
        msgElement.style.color = color;
    } else {
        alert(msg);
    }
}

// ADMIN CHECK
function isAdmin(username, password){
    return username === "admin" && password === "12102003";
}


// REGISTER FUNCTION
function registerEmployee(){
    const username = document.getElementById("username_input")?.value.trim();
    const password = document.getElementById("password_input")?.value;
    const confirmPassword = document.getElementById("password_Confirmation")?.value;

    if (verifyEmployeeRegistration(username, password, confirmPassword)) {
        showMessage("Employee registration successful!", "green");
    }
}

function registerCustomer(){
    const username = document.getElementById("username_input")?.value.trim();
    const password = document.getElementById("password_input")?.value;
    const confirmPassword = document.getElementById("password_Confirmation")?.value;

    if (verifyRegistration(username, password, confirmPassword)) {
        showMessage("Registration successful!", "green");
    }
}


// REGISTRATION VALIDATION
function verifyEmployeeRegistration(username, password, confirmPassword){

    if (!username || !password || !confirmPassword) {
        showMessage("All fields are required");
        return false;
    }
    if (password !== confirmPassword) {
        showMessage("Passwords do not match");
        return false;
    }
    if (password.length < 6) {
        showMessage("Password must be at least 6 characters");
        return false;
    }
    let users = getUsers();

    if (users.some(user => user.username === username)) {
        showMessage("Username already exists");
        return false;
    }
    // Create new employee
    let newEmployee = new Cashier(username, password);
    users.push(newEmployee);
    saveUsers(users);
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}

function verifyRegistration(username, password, confirmPassword){

    if (!username || !password || !confirmPassword) {
        showMessage("All fields are required");
        return false;
    }
    if (password !== confirmPassword) {
        showMessage("Passwords do not match");
        return false;
    }
    if (password.length < 6) {
        showMessage("Password must be at least 6 characters");
        return false;
    }
    let users = getUsers();

    if (users.some(user => user.username === username)) {
        showMessage("Username already exists");
        return false;
    }

    // Create new user
    let newUser = new Customer(username, password);
    users.push(newUser);
    saveUsers(users);
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}

// LOGIN FUNCTION
function login(){
    const username = document.getElementById("username_input")?.value.trim();
    const password = document.getElementById("password_input")?.value;

    if (!username || !password) {
        showMessage("Please enter username and password");
        return;
    }

    verifyLogin(username, password);
}

// LOGIN VALIDATION
function verifyLogin(username, password){

    // Admin login
    if (isAdmin(username, password)) {
        localStorage.setItem("currentUser", "admin");
        showMessage("Welcome Admin!", "green");

        setTimeout(() => {
            window.location.href = "../authorized/admin.html";
        }, 1000);

        return;
    }
    let users = getUsers();
    let foundUser = users.find(user => 
        user.username === username && user.password === password
    );
    if (!foundUser) {
        showMessage("Invalid username or password");
        return;
    }

    // Save logged-in user
    localStorage.setItem("currentUser", foundUser.username);
    showMessage("Login successful!", "green");
    // Role-based redirect
    setTimeout(() => {
        if (foundUser.role === "cashier") {
            window.location.href = "../authorized/cashier.html";
        } else {
            window.location.href = "../home.html";
        }
    }, 1000);
}

// LOGOUT FUNCTION
function logout(){
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}