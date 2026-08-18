document.addEventListener('DOMContentLoaded', async () => {
  const user = await WN.requireAuthOrRedirect();
  if (!user) return;
  const avatar = document.querySelector('.user-avatar');
  if (avatar) avatar.textContent = user.full_name.charAt(0).toUpperCase();

  document.querySelectorAll('.calc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.panel).classList.add('active');
    });
  });

  document.getElementById('sip-form').addEventListener('submit', handleSIP);
  document.getElementById('fd-form').addEventListener('submit', handleFD);
  document.getElementById('ci-form').addEventListener('submit', handleCI);
  document.getElementById('sg-form').addEventListener('submit', handleSavingsGoal);
});

function renderBarChart(container, series) {
  if (!series || !series.length) { container.innerHTML = ''; return; }
  const max = Math.max(...series.map(s => s.value), 1);
  container.innerHTML = `<div class="chart-wrap">` + series.map(s => `
    <div class="chart-bar-col">
      <div class="chart-bar" style="height:${Math.max((s.value / max) * 170, 4)}px" title="${WN.formatINR(s.value)}"></div>
      <div class="chart-bar-label">Yr ${s.year}</div>
    </div>`).join('') + `</div>`;
}

async function handleSIP(e) {
  e.preventDefault();
  const payload = {
    monthlyInvestment: document.getElementById('sipMonthly').value,
    annualReturnPercent: document.getElementById('sipReturn').value,
    years: document.getElementById('sipYears').value
  };
  try {
    const res = await WN.api.post('/calculators/sip', payload);
    const d = res.data;
    document.getElementById('sip-results').innerHTML = `
      <div class="calc-result-row"><span class="label">Total Amount Invested</span><span class="value">${WN.formatINR(d.totalInvested)}</span></div>
      <div class="calc-result-row"><span class="label">Estimated Returns</span><span class="value">${WN.formatINR(d.estimatedReturns)}</span></div>
      <div class="calc-result-row highlight"><span class="label">Estimated Final Value</span><span class="value">${WN.formatINR(d.estimatedFinalValue)}</span></div>
    `;
    renderBarChart(document.getElementById('sip-chart'), d.growthSeries);
    document.getElementById('sip-disclaimer').textContent = d.disclaimer;
    document.getElementById('sip-output').style.display = 'block';
  } catch (err) {  }
}

async function handleFD(e) {
  e.preventDefault();
  const payload = {
    principal: document.getElementById('fdPrincipal').value,
    annualRatePercent: document.getElementById('fdRate').value,
    years: document.getElementById('fdYears').value,
    compoundingPerYear: document.getElementById('fdCompounding').value
  };
  try {
    const res = await WN.api.post('/calculators/fd', payload);
    const d = res.data;
    document.getElementById('fd-results').innerHTML = `
      <div class="calc-result-row"><span class="label">Principal</span><span class="value">${WN.formatINR(d.principal)}</span></div>
      <div class="calc-result-row"><span class="label">Estimated Interest</span><span class="value">${WN.formatINR(d.estimatedInterest)}</span></div>
      <div class="calc-result-row highlight"><span class="label">Estimated Maturity Amount</span><span class="value">${WN.formatINR(d.estimatedMaturityAmount)}</span></div>
    `;
    document.getElementById('fd-output').style.display = 'block';
  } catch (err) {  }
}

async function handleCI(e) {
  e.preventDefault();
  const payload = {
    principal: document.getElementById('ciPrincipal').value,
    annualRatePercent: document.getElementById('ciRate').value,
    years: document.getElementById('ciYears').value,
    compoundingPerYear: document.getElementById('ciCompounding').value
  };
  try {
    const res = await WN.api.post('/calculators/compound-interest', payload);
    const d = res.data;
    document.getElementById('ci-results').innerHTML = `
      <div class="calc-result-row"><span class="label">Principal</span><span class="value">${WN.formatINR(d.principal)}</span></div>
      <div class="calc-result-row"><span class="label">Interest Earned</span><span class="value">${WN.formatINR(d.interestEarned)}</span></div>
      <div class="calc-result-row highlight"><span class="label">Final Amount</span><span class="value">${WN.formatINR(d.finalAmount)}</span></div>
    `;
    renderBarChart(document.getElementById('ci-chart'), d.growthSeries);
    document.getElementById('ci-output').style.display = 'block';
  } catch (err) {  }
}

async function handleSavingsGoal(e) {
  e.preventDefault();
  const payload = {
    targetAmount: document.getElementById('sgTarget').value,
    currentSavings: document.getElementById('sgCurrent').value || 0,
    targetDate: document.getElementById('sgDate').value,
    monthlyContribution: document.getElementById('sgContribution').value || 0
  };
  try {
    const res = await WN.api.post('/calculators/savings-goal', payload);
    const d = res.data;
    document.getElementById('sg-results').innerHTML = `
      <div class="calc-result-row"><span class="label">Amount Remaining</span><span class="value">${WN.formatINR(d.amountRemaining)}</span></div>
      <div class="calc-result-row"><span class="label">Months Remaining</span><span class="value">${d.monthsRemaining}</span></div>
      <div class="calc-result-row highlight"><span class="label">Required Monthly Contribution</span><span class="value">${WN.formatINR(d.requiredMonthlyContribution)}</span></div>
      <div class="calc-result-row"><span class="label">Current Progress</span><span class="value">${d.progressPercent}%</span></div>
    `;
    const statusEl = document.getElementById('sg-status');
    if (d.isContributionSufficient) {
      statusEl.className = 'alert alert-success';
      statusEl.textContent = 'Your current monthly contribution looks sufficient to reach this goal by your target date.';
    } else {
      statusEl.className = 'alert alert-warning';
      statusEl.textContent = 'Your current monthly contribution may not be enough to reach this goal by your target date.';
    }
    document.getElementById('sg-output').style.display = 'block';
  } catch (err) {  }
}
