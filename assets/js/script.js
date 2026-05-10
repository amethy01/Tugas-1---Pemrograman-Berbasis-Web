const comicList = document.getElementById("comicList");
const cartList = document.getElementById("cartList");
const totalItems = document.getElementById("totalItems");
const totalPrice = document.getElementById("totalPrice");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");

const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutForm = document.getElementById("checkoutForm");

const themeBtn = document.getElementById("themeBtn");

let cart = [];

// Format Rupiah
function formatRupiah(num) {
  return num.toLocaleString("id-ID");
}

// Render Katalog
function renderComics(data) {
  comicList.innerHTML = "";

  if (data.length === 0) {
    comicList.innerHTML = `<p style="font-weight:bold;">Komik tidak ditemukan!</p>`;
    return;
  }

  data.forEach((comic) => {
    const card = document.createElement("article");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${comic.image}" alt="${comic.title}">
      <div class="card-body">
        <h3>${comic.title}</h3>
        <p>Kategori: ${comic.category}</p>
        <p>Stok: ${comic.stock}</p>
        <p class="price">Rp ${formatRupiah(comic.price)}</p>
        <button class="btn success-btn" onclick="addToCart(${comic.id})">Tambah</button>
      </div>
    `;

    comicList.appendChild(card);
  });
}

// Tambah Keranjang
function addToCart(id) {
  const comic = comics.find((c) => c.id === id);

  if (!comic) return;

  const existing = cart.find((item) => item.id === id);

  if (existing) {
    if (existing.qty >= comic.stock) {
      alert("Stok tidak mencukupi!");
      return;
    }
    existing.qty++;
  } else {
    cart.push({ ...comic, qty: 1 });
  }

  alert(`${comic.title} ditambahkan ke keranjang!`);
  renderCart();
}

// Render Keranjang
function renderCart() {
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = `<p>Keranjang masih kosong.</p>`;
    totalItems.textContent = "0";
    totalPrice.textContent = "0";
    return;
  }

  let itemsCount = 0;
  let total = 0;

  cart.forEach((item) => {
    itemsCount += item.qty;
    total += item.qty * item.price;

    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <div>
        <h4>${item.title}</h4>
        <p>Rp ${formatRupiah(item.price)} x ${item.qty}</p>
      </div>
      <div>
        <button class="btn danger-btn" onclick="removeItem(${item.id})">Hapus</button>
      </div>
    `;

    cartList.appendChild(div);
  });

  totalItems.textContent = itemsCount;
  totalPrice.textContent = formatRupiah(total);
}

// Hapus Item
function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  alert("Item berhasil dihapus!");
  renderCart();
}

// Clear Cart
clearCartBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Keranjang sudah kosong!");
    return;
  }

  const confirmClear = confirm("Yakin ingin menghapus semua item?");
  if (confirmClear) {
    cart = [];
    renderCart();
  }
});

// Filter + Search + Sort
function applyFilter() {
  let filtered = [...comics];

  // SEARCH
  const keyword = searchInput.value.toLowerCase();
  filtered = filtered.filter((comic) =>
    comic.title.toLowerCase().includes(keyword),
  );

  // CATEGORY
  const category = categoryFilter.value;
  if (category !== "all") {
    filtered = filtered.filter((comic) => comic.category === category);
  }

  // SORT
  const sortValue = sortFilter.value;
  if (sortValue === "cheap") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === "expensive") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortValue === "az") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === "za") {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  }

  renderComics(filtered);
}

searchInput.addEventListener("input", applyFilter);
categoryFilter.addEventListener("change", applyFilter);
sortFilter.addEventListener("change", applyFilter);

// Validasi Form Checkout
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  const pembayaran = document.getElementById("pembayaran").value;

  if (cart.length === 0) {
    alert("Keranjang kosong! Tambahkan komik dulu sebelum checkout.");
    return;
  }

  if (nama.length < 3) {
    alert("Nama harus minimal 3 karakter!");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    alert("Email tidak valid!");
    return;
  }

  if (alamat.length < 10) {
    alert("Alamat harus lebih lengkap (minimal 10 karakter).");
    return;
  }

  if (pembayaran === "") {
    alert("Silakan pilih metode pembayaran!");
    return;
  }

  alert(
    `Checkout berhasil!\nTerima kasih ${nama} sudah belanja di Amethy Comic Store!`,
  );

  cart = [];
  renderCart();
  checkoutForm.reset();
});

// Dark Mode
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeBtn.textContent = "☀️ Light Mode";
  } else {
    themeBtn.textContent = "🌙 Dark Mode";
  }
});

// Load Awal
renderComics(comics);
renderCart();
