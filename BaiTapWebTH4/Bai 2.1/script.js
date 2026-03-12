// script.js

const form = document.getElementById('formRegister');
const registrationForm = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');
const displayUser = document.getElementById('displayUser');

// --- HÀM TIỆN ÍCH ---
function showError(id, message) {
    const field = document.getElementById(id);
    const parent = field ? field.parentElement : document.querySelector(`input[name="${id}"]`).parentElement.parentElement;
    const errorElement = parent.querySelector('.error-msg');
    
    if (field && field.type !== 'radio') field.classList.add('invalid');
    errorElement.innerText = message;
}

function clearError(id) {
    const field = document.getElementById(id);
    const parent = field ? field.parentElement : document.querySelector(`input[name="${id}"]`).parentElement.parentElement;
    const errorElement = parent.querySelector('.error-msg');
    
    if (field && field.type !== 'radio') field.classList.remove('invalid');
    errorElement.innerText = '';
}

// --- HÀM VALIDATE TỪNG TRƯỜNG ---

function validateFullname() {
    const val = document.getElementById('fullname').value.trim();
    const regex = /^[a-zA-ZÀ-ỹ\s]{3,}$/;
    if (val === "") { showError('fullname', 'Họ tên không được trống'); return false; }
    if (!regex.test(val)) { showError('fullname', 'Họ tên ít nhất 3 ký tự, chỉ chứa chữ cái'); return false; }
    clearError('fullname');
    return true;
}

function validateEmail() {
    const val = document.getElementById('email').value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val === "") { showError('email', 'Email không được trống'); return false; }
    if (!regex.test(val)) { showError('email', 'Email không đúng định dạng'); return false; }
    clearError('email');
    return true;
}

function validatePhone() {
    const val = document.getElementById('phone').value.trim();
    const regex = /^0[0-9]{9}$/;
    if (val === "") { showError('phone', 'Số điện thoại không được trống'); return false; }
    if (!regex.test(val)) { showError('phone', 'SĐT phải có 10 số và bắt đầu bằng số 0'); return false; }
    clearError('phone');
    return true;
}

function validatePassword() {
    const val = document.getElementById('password').value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (val === "") { showError('password', 'Mật khẩu không được trống'); return false; }
    if (!regex.test(val)) { showError('password', 'Mật khẩu ≥ 8 ký tự, gồm chữ Hoa, thường và số'); return false; }
    clearError('password');
    return true;
}

function validateConfirm() {
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (confirm === "") { showError('confirmPassword', 'Vui lòng xác nhận mật khẩu'); return false; }
    if (confirm !== pass) { showError('confirmPassword', 'Mật khẩu xác nhận không khớp'); return false; }
    clearError('confirmPassword');
    return true;
}

function validateGender() {
    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) { showError('gender', 'Vui lòng chọn giới tính'); return false; }
    clearError('gender');
    return true;
}

function validateTerms() {
    const checked = document.getElementById('terms').checked;
    if (!checked) { showError('terms', 'Bạn phải đồng ý với điều khoản'); return false; }
    clearError('terms');
    return true;
}

// --- GẮN SỰ KIỆN ---

// Validate realtime khi rời khỏi ô nhập (blur)
document.getElementById('fullname').addEventListener('blur', validateFullname);
document.getElementById('email').addEventListener('blur', validateEmail);
document.getElementById('phone').addEventListener('blur', validatePhone);
document.getElementById('password').addEventListener('blur', validatePassword);
document.getElementById('confirmPassword').addEventListener('blur', validateConfirm);

// Xóa lỗi khi bắt đầu gõ lại (input)
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.name === 'gender') clearError('gender');
        else clearError(input.id);
    });
});

// Xử lý Submit
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Dùng toán tử & để chạy tất cả các hàm validate (không dừng sớm)
    const isValid = 
        validateFullname() & 
        validateEmail() & 
        validatePhone() & 
        validatePassword() & 
        validateConfirm() & 
        validateGender() & 
        validateTerms();

    if (isValid) {
        registrationForm.classList.add('hidden');
        successMessage.classList.remove('hidden');
        displayUser.innerText = document.getElementById('fullname').value;
    }
});