// =====================
// AUTH GUARD (RUN FIRST)
// =====================
(function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Detect GitHub Pages subfolder
  const isGitHubPages = window.location.pathname.includes("ecommerce-frontend");
  const basePath = isGitHubPages ? "/ecommerce-frontend/" : "/";

  const isOnAuthPage = window.location.pathname.includes("auth.html");

  if (!isLoggedIn && !isOnAuthPage) {
    window.location.replace(basePath + "auth.html");
    return; // STOP executing rest of file
  }
})();

// =====================
// CART HELPERS
// =====================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartBadge() {
  const badge = document.querySelector(".cart-badge");
  if (!badge) return;
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  badge.textContent = totalQty;
}

// Init badge
updateCartBadge();

// =====================
// HERO BUTTON
// =====================
const heroBtn = document.querySelector(".hero-btn");
if (heroBtn) {
  heroBtn.addEventListener("click", () => {
    window.location.href = "#products";
  });
}

// =====================
// PRODUCTS LOADING
// =====================
const productsGrid = document.getElementById("productsGrid");
const loadingText = document.getElementById("loadingText");
const errorText = document.getElementById("errorText");

if (productsGrid) {
  fetch("https://fakestoreapi.com/products")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    })
    .then((products) => {
      console.log("Products loaded:", products);
      if (loadingText) loadingText.style.display = "none";
      displayProducts(products);
    })
    .catch((err) => {
      console.error("API error:", err);
      if (loadingText) loadingText.style.display = "none";
      if (errorText) errorText.style.display = "block";
    });
}

function displayProducts(products) {
  if (!productsGrid) return;

  productsGrid.innerHTML = "";

  products.forEach((product) => {
    const price = Math.round(product.price * 80);

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <a href="product.html?id=${product.id}" style="text-decoration:none;color:white;">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        <h4>${product.title}</h4>
        <p>₹ ${price}</p>
      </a>
      <button class="add-to-cart-btn">Add to Cart</button>
    `;

    const btn = card.querySelector(".add-to-cart-btn");
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const cart = getCart();
      const existing = cart.find((i) => i.id === product.id);

      if (existing) {
        existing.qty += 1;
        existing.total = existing.qty * existing.unitPrice;
      } else {
        cart.push({
          id: product.id,
          title: product.title,
          image: product.image,
          unitPrice: price,
          qty: 1,
          total: price
        });
      }

      saveCart(cart);
      updateCartBadge();
      alert("Added to cart!");
    });

    productsGrid.appendChild(card);
  });
}
