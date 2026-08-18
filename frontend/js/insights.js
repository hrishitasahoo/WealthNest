const DISMISS_KEY = 'wn_dismissed_insights';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getDismissed() {
  try {
    const raw = JSON.parse(localStorage.getItem(DISMISS_KEY) || '[]');

    const today = todayStr();
    const stillValid = raw.filter(entry => entry.date === today);
    if (stillValid.length !== raw.length) {
      localStorage.setItem(DISMISS_KEY, JSON.stringify(stillValid));
    }
    return stillValid.map(entry => entry.key);
  } catch (err) {
    return [];
  }
}

function dismissInsight(key) {
  let dismissed = [];
  try {
    dismissed = JSON.parse(localStorage.getItem(DISMISS_KEY) || '[]');
  } catch (err) {  }

  dismissed.push({ key, date: todayStr() });
  localStorage.setItem(DISMISS_KEY, JSON.stringify(dismissed));
  document.getElementById(`insight-${cssSafe(key)}`)?.remove();
}

function cssSafe(key) {
  return key.replace(/[^a-zA-Z0-9_-]/g, '_');
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = await WN.requireAuthOrRedirect();
  if (!user) return;
  document.querySelector('.user-avatar').textContent = user.full_name.charAt(0).toUpperCase();

  await loadInsights();
});

async function loadInsights() {
  const container = document.getElementById('insights-container');
  try {
    const res = await WN.api.get('/insights');
    const all = res.data.insights;
    const dismissed = getDismissed();
    const insights = all.filter(i => !dismissed.includes(i.key));

    if (!insights.length && all.length > 0) {

      container.innerHTML = `
        <div class="empty-state">
          <h4>You've dismissed today's insights.</h4>
          <p>They'll come back tomorrow, or you can bring them back now.</p>
          <button class="btn btn-secondary btn-sm" onclick="resetDismissed()">Show Dismissed Insights</button>
        </div>`;
      return;
    }

    if (!insights.length) {
      container.innerHTML = `
        <div class="empty-state">
          <h4>No insights right now.</h4>
          <p>As you record expenses, savings and goals, WealthNest will surface useful observations here.</p>
        </div>`;
      return;
    }

    container.innerHTML = insights.map(i => `
      <div class="insight-row ${i.type}" id="insight-${cssSafe(i.key)}">
        <div class="insight-text">${WN.escapeHTML(i.message)}</div>
        <button class="insight-dismiss" title="Dismiss for today" onclick="dismissInsight('${i.key}')">&times;</button>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<p>We could not load your insights right now. Please try again.</p>`;
  }
}

function resetDismissed() {
  localStorage.removeItem(DISMISS_KEY);
  loadInsights();
}
