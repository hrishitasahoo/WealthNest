document.addEventListener('DOMContentLoaded', async () => {
  const user = await WN.requireAuthOrRedirect();
  if (!user) return;
  document.querySelector('.user-avatar').textContent = user.full_name.charAt(0).toUpperCase();

  await loadPlan();
  document.getElementById('plan-form').addEventListener('submit', handlePlanSubmit);
});

async function loadPlan() {
  try {
    const res = await WN.api.get('/budget-plan', { silent: true });
    const plan = res.data.plan;
    if (!plan) return;

    document.getElementById('planIncome').value = plan.monthly_income;
    renderPlan(plan);
  } catch (err) { /* no plan yet - fine */ }
}

async function handlePlanSubmit(e) {
  e.preventDefault();
  const payload = { monthlyIncome: document.getElementById('planIncome').value };

  const submitBtn = document.querySelector('#plan-form button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Calculating…';

  try {
    const res = await WN.api.put('/budget-plan', payload);
    WN.toast('Your budget plan has been saved.', 'success');
    renderPlan(res.data.plan);
  } catch (err) { /* toast already shown */ }
  finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Calculate';
  }
}

function renderPlan(plan) {
  const a = plan.allocation;
  if (!a) return;

  document.getElementById('planner-output').style.display = 'block';
  document.getElementById('donut-income').textContent = WN.formatINR(plan.monthly_income);

  const needsDeg = (a.needsPercent / 100) * 360;
  const wantsDeg = (a.wantsPercent / 100) * 360;
  const savingsDeg = (a.savingsPercent / 100) * 360;

  const donut = document.getElementById('budget-donut');
  donut.style.background = `conic-gradient(
    var(--color-primary) 0deg ${needsDeg}deg,
    var(--color-secondary) ${needsDeg}deg ${needsDeg + wantsDeg}deg,
    var(--color-accent) ${needsDeg + wantsDeg}deg ${needsDeg + wantsDeg + savingsDeg}deg
  )`;

  document.getElementById('donut-legend').innerHTML = `
    <div class="donut-legend-item">
      <span class="swatch-label"><span class="swatch" style="background:var(--color-primary)"></span>Needs (${a.needsPercent}%)</span>
      <span>${WN.formatINR(a.needsAmount)}</span>
    </div>
    <div class="donut-legend-item">
      <span class="swatch-label"><span class="swatch" style="background:var(--color-secondary)"></span>Wants (${a.wantsPercent}%)</span>
      <span>${WN.formatINR(a.wantsAmount)}</span>
    </div>
    <div class="donut-legend-item">
      <span class="swatch-label"><span class="swatch" style="background:var(--color-accent)"></span>Savings (${a.savingsPercent}%)</span>
      <span>${WN.formatINR(a.savingsAmount)}</span>
    </div>
  `;

  document.getElementById('recommended-total').textContent = WN.formatINR(a.recommendedTotalExpenses);
  document.getElementById('recommended-savings').textContent = WN.formatINR(a.recommendedSavings);

  if (a.actualNeedsSpent > 0 || a.actualWantsSpent > 0) {
    document.getElementById('planner-comparison').style.display = 'block';
    document.getElementById('comparison-cards').innerHTML = `
      ${buildComparisonRow('Needs', a.actualNeedsSpent, a.needsAmount, a.needsDiff)}
      ${buildComparisonRow('Wants', a.actualWantsSpent, a.wantsAmount, a.wantsDiff)}
    `;
  } else {
    document.getElementById('planner-comparison').style.display = 'block';
    document.getElementById('comparison-cards').innerHTML = `<p class="form-hint">No expenses recorded yet this month. Add some in the Expense Tracker to see how you compare.</p>`;
  }
}

function buildComparisonRow(label, actual, recommended, diff) {
  const overBudget = diff > 0;
  return `
    <div class="allocation-card ${overBudget ? 'wants' : 'needs'}">
      <div class="allocation-head">
        <strong>${label} — ${WN.formatINR(actual)} spent</strong>
        <span>${overBudget ? 'over' : 'under'} by ${WN.formatINR(Math.abs(diff))}</span>
      </div>
      <p>Recommended limit: ${WN.formatINR(recommended)}</p>
    </div>
  `;
}
