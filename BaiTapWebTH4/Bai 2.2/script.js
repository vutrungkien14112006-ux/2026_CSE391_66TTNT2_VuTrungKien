// script.js

// 1. Dữ liệu giá sản phẩm
const prices = {
    "Laptop": 20000000,
    "Smartphone": 10000000,
    "Keyboard": 2500000,
    "Mouse": 1200000
};

// DOM Elements
const form = document.getElementById('orderForm');
const productSel = document.getElementById('product');
const quantityInp = document.getElementById('quantity');
const totalDisp = document.getElementById('totalAmount');
const noteArea = document.getElementById('note');
const charCount = document.getElementById('charCount');
const modal = document.getElementById('confirmModal');

// --- HÀM TIỆN ÍCH ---
function showError(el, msg) {
    el.classList.add('invalid');
    el.parentElement.querySelector('.error-msg').innerText = msg;
}

function clearError(el) {
    el.classList.remove('invalid');
    el.parentElement.querySelector('.error-msg').innerText = '';
}

// 2. Tính tổng tiền tự động
function calculateTotal() {
    const product = productSel.value;
    const qty = parseInt(quantityInp.value) || 0;
    const price = prices[product] || 0;
    const total = price * qty;
    totalDisp.innerText = total.toLocaleString('vi-VN') + "đ";
}

productSel.onchange = calculateTotal;
quantityInp.oninput = calculateTotal;

// 3. Đếm ký tự Ghi chú
noteArea.oninput = function() {
    const len = this.value.length;
    charCount.innerText = `${len}/200`;
    if (len > 200) {
        charCount.classList.add('text-danger');
        showError(this, "Ghi chú không được quá 200 ký tự");
    } else {
        charCount.classList.remove('text-danger');
        clearError(this);
    }
};

// 4. Các hàm Validate
function validateDate() {
    const dateVal = document.getElementById('deliveryDate').value;
    if (!dateVal) return "Vui lòng chọn ngày giao";
    
    const selectedDate = new Date(dateVal).setHours(0,0,0,0);
    const today = new Date().setHours(0,0,0,0);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    
    if (selectedDate < today) return "Ngày giao không được ở quá khứ";
    if (selectedDate > maxDate.setHours(0,0,0,0)) return "Ngày giao không quá 30 ngày từ hôm nay";
    return true;
}

// 5. Xử lý Submit Form
form.onsubmit = function(e) {
    e.preventDefault();
    let isValid = true;

    // Validate Tên sản phẩm
    if (!productSel.value) { showError(productSel, "Vui lòng chọn sản phẩm"); isValid = false; }
    else { clearError(productSel); }

    // Validate Số lượng
    const qty = parseInt(quantityInp.value);
    if (isNaN(qty) || qty < 1 || qty > 99) { showError(quantityInp, "Số lượng từ 1-99"); isValid = false; }
    else { clearError(quantityInp); }

    // Validate Ngày
    const dateMsg = validateDate();
    const dateEl = document.getElementById('deliveryDate');
    if (dateMsg !== true) { showError(dateEl, dateMsg); isValid = false; }
    else { clearError(dateEl); }

    // Validate Địa chỉ
    const addrEl = document.getElementById('address');
    if (addrEl.value.trim().length < 10) { showError(addrEl, "Địa chỉ phải từ 10 ký tự"); isValid = false; }
    else { clearError(addrEl); }

    // Validate Thanh toán
    const payment = document.querySelector('input[name="payment"]:checked');
    const paymentGroup = document.querySelector('.radio-group');
    if (!payment) { paymentGroup.parentElement.querySelector('.error-msg').innerText = "Chọn PT thanh toán"; isValid = false; }
    else { paymentGroup.parentElement.querySelector('.error-msg').innerText = ""; }

    if (isValid && noteArea.value.length <= 200) {
        showConfirmation(payment.value);
    }
};

// 6. Xử lý Modal Xác nhận
function showConfirmation(paymentMethod) {
    const content = `
        <p><b>Sản phẩm:</b> ${productSel.value}</p>
        <p><b>Số lượng:</b> ${quantityInp.value}</p>
        <p><b>Tổng tiền:</b> ${totalDisp.innerText}</p>
        <p><b>Ngày giao:</b> ${document.getElementById('deliveryDate').value}</p>
        <p><b>Thanh toán:</b> ${paymentMethod}</p>
    `;
    document.getElementById('summaryContent').innerHTML = content;
    modal.style.display = "flex";
}

document.getElementById('btnCancel').onclick = () => modal.style.display = "none";

document.getElementById('btnFinalConfirm').onclick = () => {
    alert("🎉 Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.");
    location.reload();
};