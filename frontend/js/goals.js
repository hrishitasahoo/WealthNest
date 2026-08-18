let editingGoalId = null;

document.addEventListener('DOMContentLoaded', async () => {
  const user = await WN.requireAuthOrRedirect();
  if (!user) return;
  document.querySelector('.user-avatar').textContent = user.full_name.charAt(0).toUpperCase();

  await loadGoals();

  document.getElementById('add-goal-btn').addEventListener('click', () => openGoalModal());
  document.getElementById('goal-modal-close').addEventListener('click', closeGoalModal);
  document.getElementById('goal-modal-cancel').addEventListener('click', closeGoalModal);
  document.getElementById('goal-modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'goal-modal-overlay') closeGoalModal();
  });
  document.getElementById('goal-form').addEventListener('submit', handleGoalSubmit);

  document.getElementById('targetAmount').addEventListener('input', updateGoalPreview);
  document.getElementById('timeframeMonths').addEventListener('input', updateGoalPreview);
});

function updateGoalPreview() {
  const amount = Number(document.getElementById('targetAmount').value) || 0;
  const months = Number(document.getElementById('timeframeMonths').value) || 0;
  const preview = document.getElementById('goal-preview');

  if (amount > 0 && months > 0) {
    const monthly = Math.round((amount / months) * 100) / 100;
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + months);
    preview.textContent = `You will need to save ${WN.formatINR(monthly)} per month, reaching your goal by ${WN.formatDate(targetDate)}.`;
  } else {
    preview.textContent = '';
  }
}

async function loadGoals() {
  const container = document.getElementById('goals-container');
  try {
    const res = await WN.api.get('/goals');
    const goals = res.data.goals;

    if (!goals.length) {
      container.innerHTML = `
        <div class="empty-state">
          <h4>No financial goals yet.</h4>
          <p>Create your first goal and start tracking your progress.</p>
          <button class="btn btn-primary btn-sm" onclick="openGoalModal()">Create Goal</button>
        </div>`;
      return;
    }

    container.innerHTML = `<div class="goal-grid">${goals.map(renderGoalCard).join('')}</div>`;
  } catch (err) {
    container.innerHTML = `<p>We could not load your goals right now. Please try again.</p>`;
  }
}

function renderGoalCard(g) {
  const target = Number(g.target_amount);
  const current = Number(g.current_amount);
  const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const remaining = Math.max(target - current, 0);

  return `
    <div class="goal-card">
      <div class="goal-card-head">
        <h3>${WN.escapeHTML(g.goal_name)}</h3>
        <span class="badge badge-primary">${Math.round(progress)}%</span>
      </div>
      ${g.description ? `<p style="font-size:0.85rem;">${WN.escapeHTML(g.description)}</p>` : ''}
      <div class="goal-amounts">${WN.formatINR(current)} <span>/ ${WN.formatINR(target)}</span></div>
      <div class="progress-bar"><div class="progress-bar-fill" style="width:${progress}%"></div></div>
      <div class="goal-meta">
        <span>Remaining: ${WN.formatINR(remaining)}</span>
        <span>Target date: ${WN.formatDate(g.target_date)}</span>
      </div>
      <div class="goal-meta">
        <span>Monthly saving needed: ${WN.formatINR(g.monthly_contribution)}</span>
      </div>
      <div class="goal-actions">
        <button class="btn btn-secondary btn-sm" onclick='editGoal(${JSON.stringify(g)})'>Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteGoal(${g.id})">Delete</button>
      </div>
    </div>`;
}

function monthsFromToday(dateStr) {
  const now = new Date();
  const target = new Date(dateStr);
  let months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
  return Math.max(months, 1);
}

function openGoalModal() {
  editingGoalId = null;
  document.getElementById('goal-modal-title').textContent = 'Create a Goal';
  document.getElementById('goal-form').reset();
  document.getElementById('goal-preview').textContent = '';
  document.getElementById('goal-modal-overlay').classList.add('open');
}

function editGoal(goal) {
  editingGoalId = goal.id;
  document.getElementById('goal-modal-title').textContent = 'Edit Goal';
  document.getElementById('goalName').value = goal.goal_name;
  document.getElementById('goalDescription').value = goal.description || '';
  document.getElementById('targetAmount').value = goal.target_amount;
  document.getElementById('timeframeMonths').value = monthsFromToday(goal.target_date);
  updateGoalPreview();
  document.getElementById('goal-modal-overlay').classList.add('open');
}

function closeGoalModal() {
  document.getElementById('goal-modal-overlay').classList.remove('open');
}

async function handleGoalSubmit(e) {
  e.preventDefault();
  const payload = {
    goalName: document.getElementById('goalName').value.trim(),
    description: document.getElementById('goalDescription').value.trim(),
    targetAmount: document.getElementById('targetAmount').value,
    timeframeMonths: document.getElementById('timeframeMonths').value
  };

  try {
    if (editingGoalId) {
      await WN.api.put(`/goals/${editingGoalId}`, payload);
      WN.toast('Goal updated successfully.', 'success');
    } else {
      await WN.api.post('/goals', payload);
      WN.toast('Goal created successfully.', 'success');
    }
    closeGoalModal();
    await loadGoals();
  } catch (err) {  }
}

async function deleteGoal(id) {
  if (!confirm('Are you sure you want to delete this goal? This cannot be undone.')) return;
  try {
    await WN.api.del(`/goals/${id}`);
    WN.toast('Goal deleted.', 'success');
    await loadGoals();
  } catch (err) {  }
}
