const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");
const STORAGE_KEY = "ecommerce-cart";

if (bar && nav) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (close && nav) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

function money(value) {
  return "$" + value.toFixed(2);
}

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter(
      (item) => item && item.name && Number.isFinite(Number(item.price)),
    );
  } catch (error) {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  paintCount(items);
}

function paintCount(items) {
  const count = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    node.textContent = count ? String(count) : "";
  });
}

function ensureBadges() {
  document.querySelectorAll("#lg-bag a, #mobile a[href='cart.html']").forEach((link) => {
    if (link.querySelector("[data-cart-count]")) return;
    const badge = document.createElement("span");
    badge.dataset.cartCount = "";
    badge.className = "cart-count";
    link.appendChild(badge);
  });
}

function addToCart(product) {
  const items = readCart();
  const existing = items.find((item) => item.name === product.name);
  if (existing) existing.qty += product.qty;
  else items.push(product);
  writeCart(items);
}

function parsePrice(text) {
  const value = Number(String(text).replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : null;
}

document.querySelectorAll("#product1 .pro").forEach((card) => {
  const name = card.querySelector("h5")?.textContent.trim();
  const price = parsePrice(card.querySelector("h4")?.textContent || "");
  const image = card.querySelector("img")?.getAttribute("src") || "";
  if (!name || price === null) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "cart";
  button.setAttribute("aria-label", "Add " + name);
  button.textContent = "+";
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart({ name, price, image, qty: 1 });
  });
  card.appendChild(button);
});

document.querySelectorAll(".small-img").forEach((image) => {
  image.addEventListener("click", () => {
    const main = document.getElementById("MainImg");
    if (main) main.src = image.src;
  });
});

const productButton = document.querySelector("#prodetails button.normal");
if (productButton) {
  productButton.addEventListener("click", () => {
    const details = document.querySelector(".single-pro-details");
    const name = details?.querySelector("h4")?.textContent.trim();
    const price = parsePrice(details?.querySelector("h2")?.textContent || "");
    const qty = Math.max(
      1,
      Math.floor(Number(details?.querySelector("input")?.value) || 1),
    );
    const image = document.getElementById("MainImg")?.getAttribute("src") || "";
    if (!name || price === null) return;
    addToCart({ name, price, image, qty });
    productButton.textContent = "Added";
  });
}

function renderCart() {
  const body = document.querySelector("#cart tbody");
  if (!body) return;
  const items = readCart();
  body.innerHTML = "";
  if (!items.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.textContent = "Your cart is empty.";
    row.appendChild(cell);
    body.appendChild(row);
  }
  items.forEach((item, index) => {
    const row = document.createElement("tr");
    const line = item.price * item.qty;
    row.innerHTML = "<td></td><td></td><td></td><td></td><td></td><td></td>";
    const cells = row.children;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-line";
    remove.textContent = "×";
    remove.setAttribute("aria-label", "Remove " + item.name);
    cells[0].appendChild(remove);
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = "";
    cells[1].appendChild(img);
    cells[2].textContent = item.name;
    cells[3].textContent = money(item.price);
    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.value = String(item.qty);
    input.addEventListener("change", () => {
      const next = Math.floor(Number(input.value));
      const current = readCart();
      if (!current[index]) return;
      current[index].qty = Number.isFinite(next) && next > 0 ? next : 1;
      writeCart(current);
      renderCart();
    });
    cells[4].appendChild(input);
    cells[5].textContent = money(line);
    remove.addEventListener("click", () => {
      const current = readCart();
      current.splice(index, 1);
      writeCart(current);
      renderCart();
    });
    body.appendChild(row);
  });
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const amounts = document.querySelectorAll("#subtotal td");
  if (amounts[1]) amounts[1].textContent = money(total);
  if (amounts[5]) amounts[5].textContent = money(total);
}

const checkout = document.querySelector("#subtotal button");
if (checkout) {
  checkout.addEventListener("click", () => {
    checkout.textContent = readCart().length
      ? "Checkout is not available in this demo"
      : "Your cart is empty";
  });
}

ensureBadges();
paintCount(readCart());
renderCart();
