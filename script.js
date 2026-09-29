// دالة التبديل بين الأقسام
function showTab(tabName) {
    const panels = document.querySelectorAll('.section-panel');
    panels.forEach(p => p.classList.remove('active-panel'));

    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(b => b.classList.remove('active'));

    const targetPanel = document.getElementById('tab-' + tabName);
    if (targetPanel) {
        targetPanel.classList.add('active-panel');
    }

    const targetBtn = document.querySelector(`.nav-btn[data-tab="${tabName}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
}

// إضافة موكل جديد
function addClient() {
    let name = document.getElementById('cliName').value;
    let phone = document.getElementById('cliPhone').value;
    let nid = document.getElementById('cliNationalId').value;
    let address = document.getElementById('cliAddress').value;
    let notes = document.getElementById('cliNotes').value;

    if (!name || !phone) {
        alert('يرجى إدخال اسم الموكل ورقم الهاتف على الأقل!');
        return;
    }

    let tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${name}</td>
        <td>${phone}</td>
        <td>${nid || '-'}</td>
        <td>${address || '-'}</td>
        <td>${notes || '-'}</td>
        <td><button class="btn-del" onclick="this.parentElement.parentElement.remove()">حذف</button></td>
    `;
    document.getElementById('clientsTable').appendChild(tr);

    document.getElementById('cliName').value = '';
    document.getElementById('cliPhone').value = '';
    document.getElementById('cliNationalId').value = '';
    document.getElementById('cliAddress').value = '';
    document.getElementById('cliNotes').value = '';
}

// حسابات المصروفات والعهدة
let totalSpent = 0;

function addExpense() {
    let reason = document.getElementById('expReason').value;
    let amount = parseFloat(document.getElementById('expAmount').value);

    if (!reason || isNaN(amount)) {
        alert('اكتب بيان المصروف والمبلغ بشكل صحيح!');
        return;
    }

    let tr = document.createElement('tr');
    tr.innerHTML = `<td>${reason}</td><td>${amount} ج.م</td><td><button class="btn-del" onclick="removeExp(this, ${amount})">حذف</button></td>`;
    document.getElementById('expensesTable').appendChild(tr);

    totalSpent += amount;
    document.getElementById('expReason').value = '';
    document.getElementById('expAmount').value = '';
    updateBudget();
}

function removeExp(btn, amount) {
    btn.parentElement.parentElement.remove();
    totalSpent -= amount;
    updateBudget();
}

function updateBudget() {
    let budget = parseFloat(document.getElementById('budgetInput').value) || 0;
    document.getElementById('spentVal').innerText = totalSpent;
    document.getElementById('remainVal').innerText = budget - totalSpent;
}

// إضافة جلسة
function addSession() {
    let cName = document.getElementById('sesCase').value;
    let cDate = document.getElementById('sesDate').value;
    let cNote = document.getElementById('sesNote').value;

    if (!cName || !cDate) {
        alert('أدخل القضية والتاريخ!');
        return;
    }

    let tr = document.createElement('tr');
    tr.innerHTML = `<td>${cName}</td><td>${cDate}</td><td>${cNote || '-'}</td><td><button class="btn-del" onclick="this.parentElement.parentElement.remove()">حذف</button></td>`;
    document.getElementById('sessionsTable').appendChild(tr);

    document.getElementById('sesCase').value = '';
    document.getElementById('sesDate').value = '';
    document.getElementById('sesNote').value = '';
}

// إضافة قضية
function addCase() {
    let no = document.getElementById('cNo').value;
    let client = document.getElementById('cClient').value;
    let opp = document.getElementById('cOpp').value;
    let court = document.getElementById('cCourt').value;

    if (!no || !client) {
        alert('أدخل رقم القضية والموكل!');
        return;
    }

    let tr = document.createElement('tr');
    tr.innerHTML = `<td>${no}</td><td>${client}</td><td>${opp || '-'}</td><td>${court || '-'}</td>`;
    document.getElementById('casesTable').appendChild(tr);

    document.getElementById('cNo').value = '';
    document.getElementById('cClient').value = '';
    document.getElementById('cOpp').value = '';
    document.getElementById('cCourt').value = '';
}function saveData(section) {
    let newItem = { id: Date.now() };
    let storageKey = '';
    let formId = '';

    if (section === 'clients') {
        // استخدام الأسماء الصحيحة للـ ID من كود الـ HTML الخاص بك
        const nameInput = document.getElementById('cliName');
        const phoneInput = document.getElementById('cliPhone');
        const nationalIdInput = document.getElementById('cliNationalId');

        if (!nameInput || !nameInput.value.trim()) {
            return alert('يرجى إدخال اسم الموكل!');
        }

        newItem.name = nameInput.value.trim();
        newItem.phone = phoneInput ? phoneInput.value.trim() : '';
        newItem.nationalId = nationalIdInput ? nationalIdInput.value.trim() : '';
        
        storageKey = 'unite_clients';

    } else if (section === 'expenses') {
        // بنفس الطريقة لباقي الأقسام
        const title = document.getElementById('expenseTitle')?.value.trim();
        const amount = document.getElementById('expenseAmount')?.value.trim();
        if (!title || !amount) return alert('يرجى إدخال بيان المبلغ والمصروف!');

        newItem.title = title;
        newItem.amount = amount;
        storageKey = 'unite_expenses';

    } else if (section === 'sessions') {
        const caseNum = document.getElementById('sessionCaseNumber')?.value.trim();
        if (!caseNum) return alert('يرجى إدخال رقم القضية للجلسة!');

        newItem.caseNum = caseNum;
        storageKey = 'unite_sessions';

    } else if (section === 'cases') {
        const caseNumber = document.getElementById('caseNumber')?.value.trim();
        if (!caseNumber) return alert('يرجى إدخال رقم القضية!');

        newItem.caseNumber = caseNumber;
        storageKey = 'unite_cases';
    }

    // حفظ في LocalStorage
    let list = JSON.parse(localStorage.getItem(storageKey)) || [];
    list.push(newItem);
    localStorage.setItem(storageKey, JSON.stringify(list));

    alert('تم الحفظ بنجاح!');
    renderAllSections();
}// تشغيل عرض البيانات فور فتح الصفحة
document.addEventListener('DOMContentLoaded', function() {
    renderClients();
    // أو لو عامل دالة عامة بتعرض كل الأقسام:
    // renderAllSections();
});