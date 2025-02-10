// Import Firebase
import { auth } from '../src/config/firebase'; // Update the path as necessary
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Store users in localStorage for demo purposes
const users = JSON.parse(localStorage.getItem('users')) || [];

// Handle Sign Up
document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Check if user is already logged in on page load
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateUIForLoggedInUser(currentUser);
    }
});

// Handle Sign Up Function
async function handleSignup(e) {
    e.preventDefault();

    try {
        console.log("Sign-Up Form Submitted"); // Debugging

        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const firstName = document.getElementById('firstname').value;
        const lastName = document.getElementById('lastname').value;

        // Firebase Sign Up
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("User created in Firebase");

        // Optionally, store additional user data in localStorage
        const formData = {
            fullName: `${firstName} ${lastName}`,
            email,
            password,
            newsletter: document.getElementById('newsletter').checked
        };

        const newUser = await createUser(formData);
        console.log("User created:", newUser); // Debugging

        alert('Account created successfully!');
        openLoginModal();
    } catch (error) {
        console.error("Sign-Up Error:", error.message);
        alert(error.message);
    }
}

// Create User Function (Fixed to return a Promise)
function createUser(formData) {
    return new Promise((resolve, reject) => {
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if user already exists
        if (users.find(user => user.email === formData.email)) {
            return reject(new Error('User already exists'));
        }

        const newUser = {
            id: Date.now(),
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password, // In production, this should be hashed
            newsletter: formData.newsletter
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        resolve(newUser);
    });
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();

    try {
        console.log("Login Form Submitted"); // Debugging

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        // Firebase Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in with Firebase:", userCredential.user);

        // Optionally, store user data in localStorage
        const user = await loginUser(email, password);
        console.log("User logged in:", user); // Debugging

        updateUIForLoggedInUser(user);
        closeAllModals();
    } catch (error) {
        console.error("Login Error:", error.message);
        alert(error.message);
    }
}

// Login User Function
function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return reject(new Error('Invalid credentials'));
        }

        localStorage.setItem('currentUser', JSON.stringify(user));
        resolve(user);
    });
}

// Logout Function
function handleLogout() {
    localStorage.removeItem('currentUser');
    location.reload();
}

// Update UI when user is logged in
function updateUIForLoggedInUser(user) {
    const authButtons = document.querySelector('.auth-buttons');
    authButtons.innerHTML = `
        <div class="user-menu">
            <span>Welcome, ${user.fullName}</span>
            <button onclick="handleLogout()" class="logout-btn">Logout</button>
        </div>
    `;
}

// Modal Controls
function openSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    document.querySelectorAll('.auth-modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

function switchToSignup() {
    closeModal('loginModal');
    openSignupModal();
}

function switchToLogin() {
    closeModal('signupModal');
    openLoginModal();
}

// Close modal when clicking outside
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('auth-modal')) {
        closeModal(event.target.id);
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('.auth-modal').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// Attach functions to the window object
window.openSignupModal() = openSignupModal;
window.openLoginModal() = openLoginModal;
window.closeModal() = closeModal;
window.switchToSignup() = switchToSignup;
window.switchToLogin() = switchToLogin;
window.handleLogout() = handleLogout;