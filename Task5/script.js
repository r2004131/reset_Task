// ===== Elements =====
const product_container = document.querySelector("#products-container");
const add_row_btn       = document.querySelector("#add-row-btn");
const generate_btn      = document.querySelector("#generate-btn");

const invoiceArea = document.querySelector("#invoice-area");
const invoiceBody = document.querySelector("#invoice-body");
const totalEl     = document.querySelector("#total");

const couponToggle   = document.querySelector("#coupon-toggle");
const couponBox      = document.querySelector("#coupon-box");
const couponInput    = document.querySelector("#coupon-input");
const applyCouponBtn = document.querySelector("#apply-coupon");

const discountLabel = document.querySelector("#discount-label");   // ✅ اتصلح
const inflationBtn  = document.querySelector("#inflation-btn");

// ===== State =====
let subtotal      = 0;
let couponApplied = false;
let isInflated    = false;

// ===== Constants =====
const COUPON_CODE = "ABC123";
const DISCOUNT    = 0.2;
const INFLATION   = 1.5;

// ===== recalculateTotal =====
function recalculateTotal() {
  let total = subtotal;
  if (isInflated)    total *= INFLATION;
  if (couponApplied) total *= (1 - DISCOUNT);   // ✅ أقواس
  totalEl.textContent = total.toFixed(2);
}

// ===== إضافة صف =====
add_row_btn.addEventListener("click", () => {
  const row = document.createElement("div");
  row.className = "product-row flex gap-3 items-center";
  row.innerHTML = `
    <input type="text" name="name" placeholder="Product Name" class="flex-1 bg-slate-700 rounded-lg px-3 py-2">
    <input type="number" name="price" placeholder="Price" min="0" class="w-32 bg-slate-700 rounded-lg px-3 py-2">
    <button class="remove-row-btn bg-slate-700 hover:bg-red-600 transition w-9 h-9 rounded-lg" title="Remove">×</button>
  `;
  product_container.appendChild(row);
});

// ===== حذف صف =====
product_container.addEventListener("click", (e) => {
  const btn = e.target.closest(".remove-row-btn");
  if (!btn) return;
  btn.closest(".product-row").remove();
});

// ===== توليد الفاتورة =====
generate_btn.addEventListener("click", () => {
  const rows = product_container.querySelectorAll(".product-row");

  let html = "";
  let sum = 0;
  let index = 1;
  let hasError = false;

  rows.forEach((row) => {
    if (hasError) return;

    const name  = row.querySelector('[name="name"]').value.trim();
    const price = Number(row.querySelector('[name="price"]').value);

    if (!name || !row.querySelector('[name="price"]').value || isNaN(price) || price < 0) {
      Swal.fire({ icon: "error", title: "خطأ", text: "Please fill all fields with valid values." });
      hasError = true;
      return;
    }

    sum += price;
    html += `
      <tr>
        <td>${index++}</td>
        <td>${name}</td>
        <td>${price.toFixed(2)}</td>
      </tr>`;
  });

  if (hasError) return;

  // إعادة الضبط
  subtotal      = sum;
  couponApplied = false;
  isInflated    = false;

  discountLabel.classList.add("hidden");
  couponInput.value = "";
  couponBox.classList.add("hidden");

  inflationBtn.textContent = "🚨 سكّر المعبر";
  inflationBtn.classList.remove("bg-green-600", "hover:bg-green-700");
  inflationBtn.classList.add("bg-red-600", "hover:bg-red-700");

  invoiceBody.innerHTML = html;
  invoiceArea.classList.remove("hidden");
  recalculateTotal();

  Swal.fire({ icon: "success", title: "تمت العملية", text: "Invoice generated successfully!", timer: 1500, showConfirmButton: false });
});

// ===== الكوبون — إظهار/إخفاء =====
couponToggle.addEventListener("click", () => {
  couponBox.classList.toggle("hidden");
});

// ===== الكوبون — التطبيق =====
applyCouponBtn.addEventListener("click", () => {
  const code = couponInput.value.trim().toUpperCase();   // ✅ toUpperCase

  if (code === COUPON_CODE) {
    couponApplied = true;
    discountLabel.classList.remove("hidden");
    recalculateTotal();
    Swal.fire({ icon: "success", title: "Coupon applied", timer: 1200, showConfirmButton: false });
  } else {
    couponApplied = false;
    discountLabel.classList.add("hidden");
    recalculateTotal();
    Swal.fire({ icon: "error", title: "Invalid coupon", timer: 1200, showConfirmButton: false });
  }
});

// ===== سكّر المعبر =====
inflationBtn.addEventListener("click", () => {
  if (invoiceArea.classList.contains("hidden")) {
    Swal.fire({ icon: "info", text: "Generate the invoice first." });
    return;
  }

  isInflated = !isInflated;

  inflationBtn.textContent = isInflated ? "✅ إلغاء سكّر المعبر" : "🚨 سكّر المعبر";
  inflationBtn.classList.toggle("bg-red-600", !isInflated);
  inflationBtn.classList.toggle("bg-green-600", isInflated);
  inflationBtn.classList.toggle("hover:bg-red-700", !isInflated);
  inflationBtn.classList.toggle("hover:bg-green-700", isInflated);

  recalculateTotal();
});