// ===== Elements =====
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

// ===== Tab Switching =====
loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  signupTab.classList.remove("active");
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
});

signupTab.addEventListener("click", () => {
  signupTab.classList.add("active");
  loginTab.classList.remove("active");
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
});

// ===== Password Toggle =====
document.querySelectorAll(".toggle-pass").forEach(toggle => {
  toggle.addEventListener("click", () => {
    const targetId = toggle.dataset.target;
    const input = document.getElementById(targetId);
    input.type = input.type === "password" ? "text" : "password";
  });
});

// ===== Firebase =====
const auth = window.firebaseAuth;
const { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = window.firebaseFns;

// ===== Helpers =====
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(pwd) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);
}

// ===== Signup =====
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;

  // Clear errors
  document.getElementById("signupNameError").textContent = "";
  document.getElementById("signupEmailError").textContent = "";
  document.getElementById("signupPasswordError").textContent = "";
  document.getElementById("signupConfirmError").textContent = "";

  let valid = true;

  if (name.length < 2) {
    document.getElementById("signupNameError").textContent = "Enter your full name";
    valid = false;
  }
  if (!isValidEmail(email)) {
    document.getElementById("signupEmailError").textContent = "Invalid email format";
    valid = false;
  }
  if (!isStrongPassword(password)) {
    document.getElementById("signupPasswordError").textContent =
      "Password must be 8+ chars with uppercase, lowercase and number";
    valid = false;
  }
  if (password !== confirm) {
    document.getElementById("signupConfirmError").textContent = "Passwords do not match";
    valid = false;
  }

  if (!valid) return;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Signup successful! You can now login.");
      loginTab.click();
      signupForm.reset();
    })
    .catch((error) => {
      document.getElementById("signupEmailError").textContent = error.message;
    });
});

// ===== Login =====
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  document.getElementById("loginEmailError").textContent = "";
  document.getElementById("loginPasswordError").textContent = "";

  if (!isValidEmail(email)) {
    document.getElementById("loginEmailError").textContent = "Invalid email";
    return;
  }
  if (password.length === 0) {
    document.getElementById("loginPasswordError").textContent = "Enter password";
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successful!");
      window.location.href = "index.html";
    })
    .catch((error) => {
      document.getElementById("loginPasswordError").textContent = error.message;
    });
});

// ===== Auth State Persistence =====
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.email);
  } else {
    console.log("No user logged in");
  }
});
