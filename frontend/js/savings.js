let editingSavingsId = null;
let userGoals = [];

document.addEventListener('DOMContentLoaded', async () => {
  const user = await WN.requireAuthOrRedirect();
  if (!user) return;
  document.querySelector('.user-avatar').textContent = user.full_name.charAt(0).toUpperCase();

  await loadGoalsForDropdown();
  await loadSavings();

  document.getElementById('add-savings-btn').addEventListener('click', () => openSavingsModal());
  document.getElementById('savings-modal-close').addEventListener('click', closeSavingsModal);
  document.getElementById('savings-modal-cancel').addEventListener('click', closeSavingsModal);
  document.getElementById('savings-modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'savings-modal-overlay') closeSavingsModal();
  });
  document.getElementById('savings-form').addEventListener('submit', handleSavingsSubmit);
});

async function loadGoalsForDropdown() {
  try {
    const res = await WN.api.get('/goals', { silent: true });
    userGoals = res.data.goals;
    const select = document.getElementById('savGoal');
    select.innerHTML = `<option value="">Not linked to a goal</option>` +
      userGoals.map(g => `<option value="${g.id}">${WN.escapeHTML(g.goal_name)}</option>`).join('');
  } catch (err) {  }
}

async function loadSavings() {
  const container = document.getElementById('savings-table-wrap');
  try {
    const res = await WN.api.get('/savings');
    const { entries, totalSavings } = res.data;

    document.getElementById('total-savings').textContent = WN.formatINR(totalSavings);

    if (!entries.length) {
      container.innerHTML = `
        <div class="empty-state">
          <h4>No savings activity yet.</h4>
          <p>Record your first saving to begin tracking your progress.</p>
          <button class="btn btn-primary btn-sm" onclick="openSavingsModal()">Add Saving</button>
        </div>`;
      return;
    }

    container.innerHTML = `
      <table>
        <thead><tr><th>Date</th><th>Amount</th><th>Goal</th><th>Description</th><th></th></tr></thead>
        <tbody>
          ${entries.map(s => `
            <tr>
              <td>${WN.formatDate(s.entry_date)}</td>
              <td>${WN.formatINR(s.amount)}</td>
              <td>${s.goal_name ? `<span class="badge badge-primary">${WN.escapeHTML(s.goal_name)}</span>` : '—'}</td>
              <td>${WN.escapeHTML(s.description || '—')}</td>
              <td class="table-actions">
                <button class="btn btn-secondary btn-sm" onclick='editSavings(${JSON.stringify(s)})'>Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteSavings(${s.id})">Delete</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  } catch (err) {
    container.innerHTML = `<p>We could not load your savings right now. Please try again.</p>`;
  }
}

function openSavingsModal() {
  editingSavingsId = null;
  document.getElementById('savings-modal-title').textContent = 'Add Savings Entry';
  document.getElementById('savings-form').reset();
  document.getElementById('savings-modal-overlay').classList.add('open');
}

function editSavings(entry) {
  editingSavingsId = entry.id;
  document.getElementById('savings-modal-title').textContent = 'Edit Savings Entry';
  document.getElementById('savAmount').value = entry.amount;
  document.getElementById('savDate').value = entry.entry_date.slice(0, 10);
  document.getElementById('savDescription').value = entry.description || '';
  document.getElementById('savGoal').value = entry.goal_id || '';
  document.getElementById('savings-modal-overlay').classList.add('open');
}

function closeSavingsModal() {
  document.getElementById('savings-modal-overlay').classList.remove('open');
}

async function handleSavingsSubmit(e) {
  e.preventDefault();
  const payload = {
    amount: document.getElementById('savAmount').value,
    entryDate: document.getElementById('savDate').value,
    description: document.getElementById('savDescription').value.trim(),
    goalId: document.getElementById('savGoal').value || null
  };

  try {
    if (editingSavingsId) {
      await WN.api.put(`/savings/${editingSavingsId}`, payload);
      WN.toast('Savings entry updated.', 'success');
    } else {
      await WN.api.post('/savings', payload);
      WN.toast('Savings entry added.', 'success');
    }
    closeSavingsModal();
    await loadSavings();
  } catch (err) {  }
}

async function deleteSavings(id) {
  if (!confirm('Delete this savings entry?')) return;
  try {
    await WN.api.del(`/savings/${id}`);
    WN.toast('Savings entry deleted.', 'success');
    await loadSavings();
  } catch (err) {  }
}
