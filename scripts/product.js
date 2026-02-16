// ===== Shared Cart Helpers =====
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

// Init badge on load
updateCartBadge();

// ===== Get product ID from URL =====
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const productDetail = document.getElementById("productDetail");
const loadingText = document.getElementById("loadingText");
const errorText = document.getElementById("errorText");

if (!productId) {
  if (errorText) errorText.style.display = "block";
  if (loadingText) loadingText.style.display = "none";
} else {
  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    })
    .then(product => {
      if (loadingText) loadingText.style.display = "none";
      renderProduct(product);
    })
    .catch(err => {
      console.error(err);
      if (loadingText) loadingText.style.display = "none";
      if (errorText) errorText.style.display = "block";
    });
}

function renderProduct(product) {
  // Demo variants (API doesn’t provide)
  const colors = ["Black", "Blue", "Red"];
  const sizes = ["S", "M", "L"];

  let selectedColor = colors[0];
  let selectedSize = sizes[1]; // default M
  let qty = 1;

  const unitPrice = Math.round(product.price * 80);

  if (!productDetail) return;

  productDetail.innerHTML = `
    <div class="zoom-wrap">
      <img src="${product.image}" alt="${product.title}" id="productImage"/>
    </div>

    <div class="product-info">
      <h1>${product.title}</h1>
      <p class="muted">${product.description}</p>

      <div>
        <strong>Color:</strong>
        <div class="variants" id="colorVariants">
          ${colors.map(c => `<button class="variant-btn ${c===selectedColor?'active':''}" data-color="${c}">${c}</button>`).join("")}
        </div>
      </div>

      <div>
        <strong>Size:</strong>
        <div class="variants" id="sizeVariants">
          ${sizes.map(s => `<button class="variant-btn ${s===selectedSize?'active':''}" data-size="${s}">${s}</button>`).join("")}
        </div>
      </div>

      <div class="quantity-wrap">
        <strong>Qty:</strong>
        <button class="qty-btn" id="decQty">−</button>
        <span id="qtyText">1</span>
        <button class="qty-btn" id="incQty">+</button>
      </div>

      <p class="price">Total: ₹ <span id="totalPrice">${unitPrice}</span></p>

      <button class="add-to-cart-cta" id="addToCartBtn">Add to Cart</button>
      <div class="success-msg" id="successMsg" style="display:none;">Added to cart!</div>
    </div>
  `;

  const totalPriceEl = document.getElementById("totalPrice");
  const qtyText = document.getElementById("qtyText");
  const successMsg = document.getElementById("successMsg");

  // ===== Quantity controls =====
  document.getElementById("incQty").addEventListener("click", () => {
    if (qty < 10) {
      qty++;
      qtyText.textContent = qty;
      totalPriceEl.textContent = unitPrice * qty;
    }
  });

  document.getElementById("decQty").addEventListener("click", () => {
    if (qty > 1) {
      qty--;
      qtyText.textContent = qty;
      totalPriceEl.textContent = unitPrice * qty;
    }
  });

  // ===== Variant selection =====
  document.getElementById("colorVariants").addEventListener("click", (e) => {
    if (e.target.classList.contains("variant-btn")) {
      selectedColor = e.target.dataset.color;
      setActive(e.currentTarget, e.target);
    }
  });

  document.getElementById("sizeVariants").addEventListener("click", (e) => {
    if (e.target.classList.contains("variant-btn")) {
      selectedSize = e.target.dataset.size;
      setActive(e.currentTarget, e.target);
    }
  });

  function setActive(container, activeBtn) {
    container.querySelectorAll(".variant-btn").forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
  }

  // ===== Add to Cart =====
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    if (qty < 1) return;

    const cart = getCart();

    const item = {
      id: product.id,
      title: product.title,
      image: product.image,
      unitPrice: unitPrice,
      color: selectedColor,
      size: selectedSize,
      qty: qty,
      total: unitPrice * qty
    };

    // Merge duplicates (same product + same variants)
    const existing = cart.find(p =>
      p.id === item.id &&
      p.color === item.color &&
      p.size === item.size
    );

    if (existing) {
      existing.qty += item.qty;
      existing.total = existing.qty * existing.unitPrice;
    } else {
      cart.push(item);
    }

    saveCart(cart);
    updateCartBadge();

    // Feedback
    if (successMsg) {
      successMsg.style.display = "block";
      setTimeout(() => (successMsg.style.display = "none"), 1200);
    } else {
      alert("Added to cart!");
    }
  });
}
