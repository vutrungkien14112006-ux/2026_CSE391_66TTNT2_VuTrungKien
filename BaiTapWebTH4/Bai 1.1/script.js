// script.js

// 1. Khởi tạo mảng lưu trữ danh sách sinh viên
let students = [];

const txtName = document.getElementById('txtName');
const txtScore = document.getElementById('txtScore');
const btnAdd = document.getElementById('btnAdd');
const studentBody = document.getElementById('studentBody');
const statsArea = document.getElementById('statsArea');

// 2. Hàm tính xếp loại
function getClassification(score) {
    if (score >= 8.5) return "Giỏi";
    if (score >= 7.0) return "Khá";
    if (score >= 5.0) return "Trung bình";
    return "Yếu";
}

// 3. Hàm vẽ lại bảng (Render Table)
function renderTable() {
    studentBody.innerHTML = ''; // Xóa sạch bảng cũ
    let totalScore = 0;

    students.forEach((student, index) => {
        totalScore += student.score;
        
        const row = document.createElement('tr');
        // Tô màu vàng nếu điểm dưới 5
        if (student.score < 5) {
            row.classList.add('highlight-yellow');
        }

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.score.toFixed(1)}</td>
            <td>${getClassification(student.score)}</td>
            <td><button class="btn-delete" data-index="${index}">Xóa</button></td>
        `;
        studentBody.appendChild(row);
    });

    // Cập nhật thống kê
    const avg = students.length > 0 ? (totalScore / students.length).toFixed(2) : 0;
    statsArea.innerHTML = `Tổng số sinh viên: ${students.length} | Điểm trung bình: ${avg}`;
}

// 4. Chức năng Thêm sinh viên
function addStudent() {
    const name = txtName.value.trim();
    const score = parseFloat(txtScore.value);

    // Kiểm tra hợp lệ
    if (name === "" || isNaN(score) || score < 0 || score > 10) {
        alert("Vui lòng nhập tên và điểm hợp lệ (0-10)!");
        return;
    }

    // Thêm vào mảng
    students.push({ name, score });

    // Cập nhật giao diện
    renderTable();

    // Xóa trắng input và focus
    txtName.value = "";
    txtScore.value = "";
    txtName.focus();
}

// 5. Sự kiện khi bấm nút Thêm
btnAdd.addEventListener('click', addStudent);

// 6. Xử lý phím Enter tại ô Điểm
txtScore.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addStudent();
    }
});

// 7. Event Delegation cho nút Xóa
studentBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-delete')) {
        const index = e.target.getAttribute('data-index');
        students.splice(index, 1); // Xóa phần tử khỏi mảng
        renderTable(); // Vẽ lại bảng
    }
});