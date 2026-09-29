// ==========================================
// 1. التنقل بين الأقسام (Tabs Navigation)
// ==========================================
function showTab(tabId) {
    // إخفاء كل الأقسام
    document.querySelectorAll('.section-panel').forEach(panel => {
        panel.classList.remove('active-panel');
    });
    
    // إلغاء تفعيل كل الأزرار
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // إظهار القسم المطلوب
    const targetPanel = document.getElementById(`tab-${tabId}`);
    if (targetPanel) {
        targetPanel.classList.add('active-panel');
    }

    // تفعيل الزرار الخاص بالقسم
    const targetBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
}

// ==========================================
// 2. إدارة الموكلين (Clients)
// ==========================================
function addClient() {
    const name = document.getElementById('cliName').value.trim();
    const phone = document.getElementById('cliPhone').value.trim();
    const nationalId = document.getElementById('cliNationalId').value.trim();
    const address = document.getElementById('cliAddress').value.trim();
    const notes = document.getElementById('cliNotes').value.trim();

    if (!name) {
        alert('برجاء إدخال اسم الموكل على الأقل!');
        return;
    }

    const clientData = { id: Date.now(), name, phone, nationalId, address, notes };
    let clients = JSON.parse(localStorage.getItem('unite_clients')) || [];
    clients.push(clientData);
    localStorage.setItem('unite_clients', JSON.stringify(clients));

    // تفريغ الخانات
    document.getElementById('cliName').value = '';
    document.getElementById('cliPhone').value = '';
    document.getElementById('cliNationalId').value = '';
    document.getElementById('cliAddress').value = '';
    document.getElementById('cliNotes').value = '';

    renderClients();
}

function renderClients() {
    const tbody = document.getElementById('clientsTable');
    if (!tbody) return;
    const clients = JSON.parse(localStorage.getItem('unite_clients')) || [];
    
    tbody.innerHTML = clients.map((c, index) => `
        <tr>
            <td>${c.name}</td>
            <td>${c.phone || '-'}</td>
            <td>${c.nationalId || '-'}</td>
            <td>${c.address || '-'}</td>
            <td>${c.notes || '-'}</td>
            <td>
                <button style="background:#e74c3c; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" onclick="deleteClient(${index})">
                    <i class="fa-solid fa-trash"></i> حذف
                </button>
            </td>
        </tr>
    `).join('');
}

function deleteClient(index) {
    let clients = JSON.parse(localStorage.getItem('unite_clients')) || [];
    clients.splice(index, 1);
    localStorage.setItem('unite_clients', JSON.stringify(clients));
    renderClients();
}

// ==========================================
// 3. إدارة العهد والمصروفات (Expenses)
// ==========================================
function updateBudget() {
    const totalBudget = parseFloat(document.getElementById('budgetInput').value) || 0;
    localStorage.setItem('unite_budget', totalBudget);
    calculateExpensesSummary();
}

function addExpense() {
    const reason = document.getElementById('expReason').value.trim();
    const amount = parseFloat(document.getElementById('expAmount').value) || 0;

    if (!reason || amount <= 0) {
        alert('برجاء إدخال بيان المصروف ومبلغ صحيح!');
        return;
    }

    const expData = { id: Date.now(), reason, amount };
    let expenses = JSON.parse(localStorage.getItem('unite_expenses')) || [];
    expenses.push(expData);
    localStorage.setItem('unite_expenses', JSON.stringify(expenses));

    document.getElementById('expReason').value = '';
    document.getElementById('expAmount').value = '';

    renderExpenses();
}

function renderExpenses() {
    const tbody = document.getElementById('expensesTable');
    if (!tbody) return;
    const expenses = JSON.parse(localStorage.getItem('unite_expenses')) || [];

    tbody.innerHTML = expenses.map((e, index) => `
        <tr>
            <td>${e.reason}</td>
            <td>${e.amount} ج.م</td>
            <td>
                <button style="background:#e74c3c; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" onclick="deleteExpense(${index})">
                    <i class="fa-solid fa-trash"></i> حذف
                </button>
            </td>
        </tr>
    `).join('');

    calculateExpensesSummary();
}

function deleteExpense(index) {
    let expenses = JSON.parse(localStorage.getItem('unite_expenses')) || [];
    expenses.splice(index, 1);
    localStorage.setItem('unite_expenses', JSON.stringify(expenses));
    renderExpenses();
}

function calculateExpensesSummary() {
    const expenses = JSON.parse(localStorage.getItem('unite_expenses')) || [];
    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalBudget = parseFloat(localStorage.getItem('unite_budget')) || 0;
    const remaining = totalBudget - totalSpent;

    const spentElem = document.getElementById('spentVal');
    const remainElem = document.getElementById('remainVal');
    const budgetInput = document.getElementById('budgetInput');

    if (spentElem) spentElem.innerText = totalSpent;
    if (remainElem) remainElem.innerText = remaining;
    if (budgetInput && !budgetInput.value) budgetInput.value = totalBudget || '';
}

// ==========================================
// 4. إدارة الجلسات (Sessions)
// ==========================================
function addSession() {
    const caseName = document.getElementById('sesCase').value.trim();
    const date = document.getElementById('sesDate').value;
    const note = document.getElementById('sesNote').value.trim();

    if (!caseName || !date) {
        alert('برجاء إدخال القضية وتاريخ الجلسة!');
        return;
    }

    const sessionData = { id: Date.now(), caseName, date, note };
    let sessions = JSON.parse(localStorage.getItem('unite_sessions')) || [];
    sessions.push(sessionData);
    localStorage.setItem('unite_sessions', JSON.stringify(sessions));

    document.getElementById('sesCase').value = '';
    document.getElementById('sesDate').value = '';
    document.getElementById('sesNote').value = '';

    renderSessions();
}

function renderSessions() {
    const tbody = document.getElementById('sessionsTable');
    if (!tbody) return;
    const sessions = JSON.parse(localStorage.getItem('unite_sessions')) || [];

    tbody.innerHTML = sessions.map((s, index) => `
        <tr>
            <td>${s.caseName}</td>
            <td>${s.date}</td>
            <td>${s.note || '-'}</td>
            <td>
                <button style="background:#e74c3c; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" onclick="deleteSession(${index})">
                    <i class="fa-solid fa-trash"></i> حذف
                </button>
            </td>
        </tr>
    `).join('');
}

function deleteSession(index) {
    let sessions = JSON.parse(localStorage.getItem('unite_sessions')) || [];
    sessions.splice(index, 1);
    localStorage.setItem('unite_sessions', JSON.stringify(sessions));
    renderSessions();
}

// ==========================================
// 5. إدارة القضايا (Cases)
// ==========================================
function addCase() {
    const caseNo = document.getElementById('cNo').value.trim();
    const client = document.getElementById('cClient').value.trim();
    const opponent = document.getElementById('cOpp').value.trim();
    const court = document.getElementById('cCourt').value.trim();

    if (!caseNo || !client) {
        alert('برجاء إدخال رقم القضية واسم الموكل!');
        return;
    }

    const caseData = { id: Date.now(), caseNo, client, opponent, court };
    let cases = JSON.parse(localStorage.getItem('unite_cases')) || [];
    cases.push(caseData);
    localStorage.setItem('unite_cases', JSON.stringify(cases));

    document.getElementById('cNo').value = '';
    document.getElementById('cClient').value = '';
    document.getElementById('cOpp').value = '';
    document.getElementById('cCourt').value = '';

    renderCases();
}

function renderCases() {
    const tbody = document.getElementById('casesTable');
    if (!tbody) return;
    const cases = JSON.parse(localStorage.getItem('unite_cases')) || [];

    tbody.innerHTML = cases.map((c, index) => `
        <tr>
            <td>${c.caseNo}</td>
            <td>${c.client}</td>
            <td>${c.opponent || '-'}</td>
            <td>${c.court || '-'}</td>
        </tr>
    `).join('');
}

// ==========================================
// 6. تشغيل استرجاع البيانات تلقائياً فور فتح الصفحة
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    renderClients();
    renderExpenses();
    renderSessions();
    renderCases();
});
