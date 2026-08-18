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
    document.getElementById('planExpenses').value = plan.recurring_expenses ?? '';
    renderPlan(plan);
  } catch (err) {  }
}

async function handlePlanSubmit(e) {
  e.preventDefault();
  const payload = {
    monthlyIncome: document.getElementById('planIncome').value,
    recurringExpenses: document.getElementById('planExpenses').value || null
  };

  const submitBtn = document.querySelector('#plan-form button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Calculating…';

  try {
    const res = await WN.api.put('/budget-plan', payload);
    WN.toast('Your budget plan has been saved.', 'success');
    renderPlan(res.data.plan);
  } catch (err) {  }
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
      <span class="swatch-label"><span class="swatch" style="background:var(--color-primary)"></span>Needs (50%)</span>
      <span>${WN.formatINR(a.needsAmount)}</span>
    </div>
    <div class="donut-legend-item">
      <span class="swatch-label"><span class="swatch" style="background:var(--color-secondary)"></span>Wants (30%)</span>
      <span>${WN.formatINR(a.wantsAmount)}</span>
    </div>
    <div class="donut-legend-item">
      <span class="swatch-label"><span class="swatch" style="background:var(--color-accent)"></span>Savings (20%)</span>
      <span>${WN.formatINR(a.savingsAmount)}</span>
    </div>
  `;

  document.getElementById('recommended-total').textContent = WN.formatINR(a.recommendedTotalExpenses);
  document.getElementById('recommended-savings').textContent = WN.formatINR(a.recommendedSavings);

  const comparisonEl = document.getElementById('plan-comparison');
  if (a.comparison) {
    comparisonEl.textContent = a.comparison;
    comparisonEl.style.display = 'block';
  } else {
    comparisonEl.style.display = 'none';
  }
}
