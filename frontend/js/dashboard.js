document.addEventListener('DOMContentLoaded', async () => {
  const user = await WN.requireAuthOrRedirect();
  if (!user) return;

  document.getElementById('greeting-name').textContent = user.full_name.split(' ')[0];
  document.querySelector('.user-avatar').textContent = user.full_name.charAt(0).toUpperCase();
  document.querySelector('.user-avatar').title = user.full_name;

  await loadDashboard();
  await loadInsights();
  await loadSavingsChart('monthly');

  document.querySelectorAll('.chart-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chart-tabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadSavingsChart(btn.dataset.range);
    });
  });
});

async function loadDashboard() {
  try {
    const res = await WN.api.get('/dashboard');
    const { financialSummary, goalsSummary, expenseSummary, budgetProgress } = res.data;

    document.getElementById('stat-income').textContent = WN.formatINR(financialSummary.monthlyIncome);
    document.getElementById('stat-expenses').textContent = WN.formatINR(financialSummary.monthlyExpenses);
    document.getElementById('stat-savings').textContent = WN.formatINR(financialSummary.monthlySavings);
    document.getElementById('stat-available').textContent = WN.formatINR(financialSummary.availableThisMonth);

    document.getElementById('expense-total').textContent = WN.formatINR(expenseSummary.totalSpent);

    const progressWrap = document.getElementById('budget-progress-wrap');
    if (budgetProgress) {
      progressWrap.innerHTML = `
        <div class="progress-bar"><div class="progress-bar-fill ${budgetProgress.percentUsed > 90 ? 'warn' : ''}" style="width:${Math.min(budgetProgress.percentUsed, 100)}%"></div></div>
        <div class="goal-meta"><span>${budgetProgress.percentUsed}% of budget used</span><span>${WN.formatINR(budgetProgress.remaining)} remaining</span></div>
      `;
    } else {
      progressWrap.innerHTML = `<p class="form-hint">Set up a <a href="budget.html">Budget Plan</a> to see progress here.</p>`;
    }

    if (!res.data.profileComplete) {
      document.getElementById('profile-nudge').style.display = 'flex';
    }

    renderGoalsPreview(goalsSummary.goals);
  } catch (err) {
    console.error(err);
  }
}

function renderGoalsPreview(goals) {
  const container = document.getElementById('goals-preview');
  if (!goals || goals.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h4>No financial goals yet.</h4>
        <p>Create your first goal and start tracking your progress.</p>
        <a href="goals.html" class="btn btn-primary btn-sm">Create Goal</a>
      </div>`;
    return;
  }

  container.innerHTML = goals.map(g => {
    const progress = Math.min((Number(g.current_amount) / Number(g.target_amount)) * 100, 100);
    return `
      <div class="goal-card">
        <div class="goal-card-head">
          <h3>${WN.escapeHTML(g.goal_name)}</h3>
          <span class="badge badge-primary">${Math.round(progress)}%</span>
        </div>
        <div class="goal-amounts">${WN.formatINR(g.current_amount)} <span>/ ${WN.formatINR(g.target_amount)}</span></div>
        <div class="progress-bar"><div class="progress-bar-fill" style="width:${progress}%"></div></div>
        <div class="goal-meta"><span>Target: ${WN.formatDate(g.target_date)}</span></div>
      </div>`;
  }).join('');
}

async function loadInsights() {
  const container = document.getElementById('insights-list');
  try {
    const res = await WN.api.get('/insights');
    const insights = res.data.insights.slice(0, 3);

    if (!insights.length) {
      container.innerHTML = `<p>No insights available yet.</p>`;
      return;
    }

    container.innerHTML = insights.map(i => `
      <div class="insight-item ${i.type}">
        <span class="insight-dot"></span>
        <span>${WN.escapeHTML(i.message)}</span>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<p>We could not load your insights right now.</p>`;
  }
}

async function loadSavingsChart(range) {
  const chartWrap = document.getElementById('savings-chart');
  chartWrap.innerHTML = `<div class="skeleton" style="width:100%;height:100%;"></div>`;

  try {
    const res = await WN.api.get(`/savings?range=${range}`);
    const series = res.data.series;

    if (!series.length) {
      chartWrap.innerHTML = `
        <div class="empty-state" style="width:100%;">
          <h4>No savings activity yet.</h4>
          <p>Record your first saving to begin tracking your progress.</p>
        </div>`;
      return;
    }

    const max = Math.max(...series.map(s => s.total), 1);
    chartWrap.innerHTML = series.map(s => `
      <div class="chart-bar-col">
        <div class="chart-bar" style="height:${Math.max((s.total / max) * 170, 4)}px" title="${WN.formatINR(s.total)}"></div>
        <div class="chart-bar-label">${s.period.slice(5)}</div>
      </div>
    `).join('');
  } catch (err) {
    chartWrap.innerHTML = `<p>We could not load your savings chart right now.</p>`;
  }
}
