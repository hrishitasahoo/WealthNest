let editingEntryId = null;
let activeCategory = '';
let searchDebounce = null;

document.addEventListener('DOMContentLoaded', async () => {
  const user = await WN.requireAuthOrRedirect();
  if (!user) return;
  document.querySelector('.user-avatar').textContent = user.full_name.charAt(0).toUpperCase();

  await loadExpenseSummary();
  await loadExpenses();

  document.getElementById('add-expense-btn').addEventListener('click', () => openExpenseModal());
  document.getElementById('expense-modal-close').addEventListener('click', closeExpenseModal);
  document.getElementById('expense-modal-cancel').addEventListener('click', closeExpenseModal);
  document.getElementById('expense-modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'expense-modal-overlay') closeExpenseModal();
  });
  document.getElementById('expense-form').addEventListener('submit', handleExpenseSubmit);

  document.getElementById('expense-search').addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(loadExpenses, 300);
  });
  document.getElementById('expense-month-filter').addEventListener('change', loadExpenses);
});

async function loadExpenseSummary() {
  try {
    const res = await WN.api.get('/budget/summary');
    const d = res.data;

    document.getElementById('stat-total-spent').textContent = WN.formatINR(d.totalSpent);

    if (d.largestCategory) {
      document.getElementById('stat-largest-category').textContent = d.largestCategory.category;
      document.getElementById('stat-largest-amount').textContent = WN.formatINR(d.largestCategory.amount);
    } else {
      document.getElementById('stat-largest-category').textContent = '—';
      document.getElementById('stat-largest-amount').textContent = 'No expenses recorded yet.';
    }

    document.getElementById('stat-daily-avg').textContent = WN.formatINR(d.dailyAverage);

    if (d.remainingBudget !== null) {
      document.getElementById('stat-remaining-budget').textContent = WN.formatINR(d.remainingBudget);
      document.getElementById('stat-remaining-note').textContent = d.remainingBudget < 0 ? 'Over budget for this month.' : 'Based on your Budget Plan.';
    } else {
      document.getElementById('stat-remaining-budget').textContent = '—';
      document.getElementById('stat-remaining-note').innerHTML = 'Set up a <a href="budget.html">Budget Plan</a> to see this.';
    }
  } catch (err) {  }
}

async function loadExpenses() {
  const tableWrap = document.getElementById('expense-table-wrap');
  const breakdownWrap = document.getElementById('category-breakdown');
  const pillWrap = document.getElementById('category-pills');

  try {
    const params = new URLSearchParams();
    if (activeCategory) params.set('category', activeCategory);
    const month = document.getElementById('expense-month-filter').value;
    if (month) params.set('month', month);
    const search = document.getElementById('expense-search').value.trim();
    if (search) params.set('search', search);

    const res = await WN.api.get(`/budget?${params.toString()}`);
    const { entries, byCategory, categories } = res.data;

    if (!pillWrap.dataset.built) {
      pillWrap.innerHTML = `<button class="category-pill active" data-cat="">All</button>` +
        categories.map(c => `<button class="category-pill" data-cat="${c}">${c}</button>`).join('');
      pillWrap.dataset.built = '1';
      pillWrap.querySelectorAll('.category-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          activeCategory = btn.dataset.cat;
          pillWrap.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          loadExpenses();
        });
      });
    }

    if (!entries.length) {
      tableWrap.innerHTML = `
        <div class="empty-state">
          <h4>No expenses recorded yet.</h4>
          <p>Add your first expense to start understanding your spending.</p>
          <button class="btn btn-primary btn-sm" onclick="openExpenseModal()">Add Expense</button>
        </div>`;
    } else {
      tableWrap.innerHTML = `
        <table>
          <thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Payment</th><th>Description</th><th></th></tr></thead>
          <tbody>
            ${entries.map(e => `
              <tr>
                <td>${WN.formatDate(e.entry_date)}</td>
                <td><span class="badge badge-secondary">${WN.escapeHTML(e.category)}</span></td>
                <td>${WN.formatINR(e.amount)}</td>
                <td>${WN.escapeHTML(e.payment_method || '—')}</td>
                <td>${WN.escapeHTML(e.description || '—')}</td>
                <td class="table-actions">
                  <button class="btn btn-secondary btn-sm" onclick='editExpense(${JSON.stringify(e)})'>Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteExpense(${e.id})">Delete</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>`;
    }

    const entriesTotal = Object.values(byCategory).reduce((a, b) => a + b, 0);
    if (entriesTotal === 0) {
      breakdownWrap.innerHTML = `<p>No spending recorded yet.</p>`;
    } else {
      breakdownWrap.innerHTML = Object.entries(byCategory)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, amt]) => {
          const pct = (amt / entriesTotal) * 100;
          return `
            <div class="category-breakdown-item">
              <div class="category-breakdown-row"><span>${cat}</span><span>${WN.formatINR(amt)}</span></div>
              <div class="category-breakdown-bar"><div class="category-breakdown-fill" style="width:${pct}%"></div></div>
            </div>`;
        }).join('');
    }

    await loadExpenseSummary();
  } catch (err) {
    tableWrap.innerHTML = `<p>We could not load your expenses right now. Please try again.</p>`;
  }
}

function openExpenseModal() {
  editingEntryId = null;
  document.getElementById('expense-modal-title').textContent = 'Add Expense';
  document.getElementById('expense-form').reset();
  document.getElementById('expense-modal-overlay').classList.add('open');
}

function editExpense(entry) {
  editingEntryId = entry.id;
  document.getElementById('expense-modal-title').textContent = 'Edit Expense';
  document.getElementById('expCategory').value = entry.category;
  document.getElementById('expPaymentMethod').value = entry.payment_method || '';
  document.getElementById('expAmount').value = entry.amount;
  document.getElementById('expDescription').value = entry.description || '';
  document.getElementById('expNote').value = entry.note || '';
  document.getElementById('expDate').value = entry.entry_date.slice(0, 10);
  document.getElementById('expense-modal-overlay').classList.add('open');
}

function closeExpenseModal() {
  document.getElementById('expense-modal-overlay').classList.remove('open');
}

async function handleExpenseSubmit(e) {
  e.preventDefault();
  const payload = {
    category: document.getElementById('expCategory').value,
    paymentMethod: document.getElementById('expPaymentMethod').value || null,
    amount: document.getElementById('expAmount').value,
    description: document.getElementById('expDescription').value.trim(),
    note: document.getElementById('expNote').value.trim(),
    entryDate: document.getElementById('expDate').value
  };

  try {
    if (editingEntryId) {
      await WN.api.put(`/budget/${editingEntryId}`, payload);
      WN.toast('Expense updated successfully.', 'success');
    } else {
      await WN.api.post('/budget', payload);
      WN.toast('Expense added successfully.', 'success');
    }
    closeExpenseModal();
    await loadExpenses();
  } catch (err) {  }
}

async function deleteExpense(id) {
  if (!confirm('Delete this expense entry?')) return;
  try {
    await WN.api.del(`/budget/${id}`);
    WN.toast('Expense deleted.', 'success');
    await loadExpenses();
  } catch (err) {  }
}
