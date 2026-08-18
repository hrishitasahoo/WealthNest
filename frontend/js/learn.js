document.addEventListener('DOMContentLoaded', () => {

  setTimeout(() => document.body.classList.remove('wn-auth-pending'), 3000);

  adaptLearnLayout();
  loadTopics();
  document.getElementById('learn-modal-close').addEventListener('click', closeTopicModal);
  document.getElementById('learn-modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'learn-modal-overlay') closeTopicModal();
  });
});

async function adaptLearnLayout() {
  try {
    const res = await WN.api.get('/auth/me', { silent: true });
    const user = res.data.user;

    document.getElementById('learn-shell').classList.remove('guest-mode');
    document.getElementById('learn-nav-slot').outerHTML = '<div class="header-section-label">Learn</div>';
    document.getElementById('learn-nav-toggle').style.display = 'none';
    document.getElementById('learn-actions-slot').innerHTML = `
      <div class="user-menu">
        <a href="settings.html" class="user-avatar" title="Account settings">${WN.escapeHTML(user.full_name.charAt(0).toUpperCase())}</a>
        <a href="#" id="learn-logout" class="btn btn-secondary btn-sm">Log Out</a>
      </div>
    `;
    document.getElementById('learn-logout').addEventListener('click', async (e) => {
      e.preventDefault();
      try { await WN.api.post('/auth/logout'); } catch (err) {  }
      window.location.href = '/index.html';
    });
  } catch (err) {

  } finally {
    document.body.classList.remove('wn-auth-pending');
  }
}

async function loadTopics() {
  const container = document.getElementById('learn-grid');
  try {
    const res = await WN.api.get('/learn', { silent: true });
    const topics = res.data.topics;

    container.innerHTML = topics.map(t => `
      <div class="learn-card" onclick="openTopic('${t.slug}')">
        <span class="badge badge-primary">${WN.escapeHTML(t.category)}</span>
        <h3>${WN.escapeHTML(t.title)}</h3>
        <p>${WN.escapeHTML(t.simple_explanation.slice(0, 100))}${t.simple_explanation.length > 100 ? '…' : ''}</p>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<p>We could not load learning topics right now. Please try again.</p>`;
  }
}

async function openTopic(slug) {
  try {
    const res = await WN.api.get(`/learn/${slug}`);
    const t = res.data.topic;

    document.getElementById('learn-modal-title').textContent = t.title;
    document.getElementById('learn-modal-body').innerHTML = `
      <h4>Simple Explanation</h4>
      <p>${WN.escapeHTML(t.simple_explanation)}</p>
      <h4>Example</h4>
      <p>${WN.escapeHTML(t.example_text)}</p>
      <h4>Things to Remember</h4>
      <ul>${t.key_points.map(k => `<li>${WN.escapeHTML(k)}</li>`).join('')}</ul>
    `;
    document.getElementById('learn-modal-overlay').classList.add('open');
  } catch (err) {  }
}

function closeTopicModal() {
  document.getElementById('learn-modal-overlay').classList.remove('open');
}
