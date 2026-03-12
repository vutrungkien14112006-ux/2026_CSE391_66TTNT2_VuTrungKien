// script.js

let students = [];
let sortDirection = 0; 


const txtName = document.getElementById('txtName');
const txtScore = document.getElementById('txtScore');
const btnAdd = document.getElementById('btnAdd');
const tableBody = document.getElementById('studentBody');
const statsArea = document.getElementById('statistics');


const searchInput = document.getElementById('searchName');
const filterSelect = document.getElementById('filterRank');
const sortHeader = document.getElementById('sortScore');
const sortIcon = document.getElementById('sortIcon');

function getRank(score) {
    if (score >= 8.5) return "Giỏi";
    if (score >= 7.0) return "Khá";
    if (score >= 5.0) return "Trung bình";
    return "Yếu";
}

function applyFilters() {
    const keyword = searchInput.value.toLowerCase();
    const rankFilter = filterSelect.value;

   
    let filtered = students.filter(s => {
        const matchesName = s.name.toLowerCase().includes(keyword);
        const matchesRank = (rankFilter === "all") || (getRank(s.score) === rankFilter);
        return matchesName && matchesRank;
    });

    if (sortDirection === 1) {
        filtered.sort((a, b) => a.score - b.score);
        sortIcon.innerText = "▲";
    } else if (sortDirection === 2) {
        filtered.sort((a, b) => b.score - a.score);
        sortIcon.innerText = "▼";
    } else {
        sortIcon.innerText = "↕";
    }

    renderTable(filtered);
}


function renderTable(data) {
    tableBody.innerHTML = '';
    
    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">Không có kết quả phù hợp</td></tr>';
        statsArea.innerText = "Tổng số: 0 | Điểm TB: 0.00";
        return;
    }

    let sum = 0;
    data.forEach((s, index) => {
        sum += s.score;
        const tr = document.createElement('tr');
        if (s.score < 5) tr.classList.add('low-score');

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${s.name}</td>
            <td>${s.score.toFixed(1)}</td>
            <td>${getRank(s.score)}</td>
            <td><button class="btn-delete" onclick="deleteStudent(${s.id})">Xóa</button></td>
        `;
        tableBody.appendChild(tr);
    });

    const avg = (sum / data.length).toFixed(2);
    statsArea.innerText = `Tổng số: ${data.length} | Điểm TB: ${avg}`;
    
}

btnAdd.onclick = () => {
    const name = txtName.value.trim();
    const score = parseFloat(txtScore.value);

    if (!name || isNaN(score) || score < 0 || score > 10) {
        alert("Thông tin không hợp lệ!");
        txtName.focus();
        return;
    }

    students.push({ id: Date.now(), name, score });
    txtName.value = "";
    txtScore.value = "";
    
    applyFilters();
    
    txtName.focus();
};


function deleteStudent(id) {
    students = students.filter(s => s.id !== id);
    applyFilters();
   
    txtName.focus(); 
}

searchInput.oninput = applyFilters;
filterSelect.onchange = applyFilters;

sortHeader.onclick = () => {
    sortDirection = (sortDirection + 1) % 3;
    applyFilters();
};

txtScore.onkeypress = (e) => { if (e.key === 'Enter') btnAdd.onclick(); };