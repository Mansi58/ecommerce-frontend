// ===== Shared Helpers =====
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartBadge() {
  const cart = getCart();
  const badge = document.querySelector(".cart-badge");
  if (!badge) return;
  const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  badge.textContent = totalQty;
}

// ===== Cart Page Logic =====
const cartContainer = document.getElementById("cartContainer");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

function renderCart() {
  const cart = getCart();
  updateCartBadge();

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    cartTotalEl.textContent = "0";
    checkoutBtn.disabled = true;
    checkoutBtn.style.opacity = "0.5";
    return;
  }

  checkoutBtn.disabled = false;
  checkoutBtn.style.opacity = "1";

  let grandTotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.unitPrice * item.qty;
    grandTotal += itemTotal;

    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />

      <div>
        <h4>${item.title}</h4>
        <div class="muted">Color: ${item.color} | Size: ${item.size}</div>
      </div>

      <div class="price-col">
        ₹ ${item.unitPrice}
      </div>

      <div class="qty-col qty-control">
        <button class="dec-btn">−</button>
        <span>${item.qty}</span>
        <button class="inc-btn">+</button>
      </div>

      <div class="remove-col">
        <button class="remove-btn">Remove</button>
      </div>
    `;

    // Quantity buttons
    const decBtn = row.querySelector(".dec-btn");
    const incBtn = row.querySelector(".inc-btn");
    const removeBtn = row.querySelector(".remove-btn");

    decBtn.addEventListener("click", () => {
      if (item.qty > 1) {
        item.qty--;
        item.total = item.qty * item.unitPrice;
        saveCart(cart);
        renderCart();
      }
    });

    incBtn.addEventListener("click", () => {
      if (item.qty < 99) {
        item.qty++;
        item.total = item.qty * item.unitPrice;
        saveCart(cart);
        renderCart();
      }
    });

    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
    });

    cartContainer.appendChild(row);
  });

  cartTotalEl.textContent = grandTotal;
}

// Checkout button (demo)
checkoutBtn.addEventListener("click", () => {
  alert("Proceeding to checkout (demo)!");
});

// Initial render
renderCart();
