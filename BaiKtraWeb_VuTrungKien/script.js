$().ready(function() {
    let students = JSON.parse(localStorage.getItem('students')) || [];

    // --- 1. ĐIỀU KHIỂN CHUYỂN VIEW ---
    function showListView() {
        $('#form-view').removeClass('active');
        $('#list-view').addClass('active');
        $('#list-actions-bar').show();
        renderList();
    }

    function showFormView() {
        $('#list-view').removeClass('active');
        $('#form-view').addClass('active');
        $('#list-actions-bar').hide(); // Ẩn nút Add khi đang ở trong form
    }

    $('#btn-add-student').click(function() {
        $('#student-form')[0].reset();
        $('#edit-index').val(''); // Reset index sửa
        validator.resetForm();    // Xóa các thông báo lỗi cũ
        showFormView();
    });

    $('#btn-cancel').click(showListView);

    // --- 2. RENDER DANH SÁCH ---
    function renderList() {
        const listContainer = $('#student-list');
        listContainer.empty();

        if (students.length === 0) {
            listContainer.html('<p style="text-align:center; padding:20px;">Chưa có dữ liệu sinh viên.</p>');
            $('#pagination-text').text('Showing 0 entries');
            return;
        }

        students.forEach((s, index) => {
            const html = `
                <div class="student-item">
                    <div class="student-info">
                        <h4>${s.fullname}</h4>
                        <p>Mã SV: ${s.studentid} | Email: ${s.email} | SĐT: ${s.phone}</p>
                        <p>Ngành: ${s.major} | Giới tính: ${s.gender}</p>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-warning btn-sm" onclick="editStudent(${index})">Sửa</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteStudent(${index})">Xoá</button>
                    </div>
                </div>
            `;
            listContainer.append(html);
        });
        $('#pagination-text').text(`Showing 1 to ${students.length} of ${students.length} entries`);
    }

    // --- 3. CRUD LOGIC ---
    window.deleteStudent = function(index) {
        if (confirm("Xác nhận xoá sinh viên này?")) {
            students.splice(index, 1);
            localStorage.setItem('students', JSON.stringify(students));
            renderList();
        }
    };

    window.editStudent = function(index) {
        const s = students[index];
        $('#edit-index').val(index);
        $('#fullname').val(s.fullname);
        $('#studentid').val(s.studentid);
        $('#email').val(s.email);
        $('#phone').val(s.phone);
        $('#major').val(s.major);
        $(`input[name="gender"][value="${s.gender}"]`).prop('checked', true);
        
        validator.resetForm();
        showFormView();
    };

    // --- 4. JQUERY VALIDATION ---
    $.validator.addMethod("validateSV", function(value, element) {
        return this.optional(element) || /^SV\d{3}$/.test(value);
    }, "Định dạng mã SV không hợp lệ (VD: SV001)");

    const validator = $("#student-form").validate({
        rules: {
            fullname: "required",
            studentid: { required: true, validateSV: true },
            email: { required: true, email: true },
            phone: { required: true, digits: true, minlength: 10 },
            major: "required",
            gender: "required"
        },
        messages: {
            fullname: "Vui lòng nhập tên",
            studentid: { required: "Nhập mã SV" },
            email: "Email không hợp lệ",
            phone: "SĐT gồm ít nhất 10 chữ số",
            major: "Chọn ngành",
            gender: "Chọn giới tính"
        },
        submitHandler: function(form) {
            const studentData = {
                fullname: $('#fullname').val(),
                studentid: $('#studentid').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                major: $('#major').val(),
                gender: $('input[name="gender"]:checked').val()
            };

            const idx = $('#edit-index').val();
            if (idx === "") {
                students.push(studentData);
            } else {
                students[idx] = studentData;
            }

            localStorage.setItem('students', JSON.stringify(students));
            alert("Đã lưu thành công!");
            showListView(); // Quay lại trang danh sách
        }
    });

    // Chạy render lần đầu
    renderList();
});