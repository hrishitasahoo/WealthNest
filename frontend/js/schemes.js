document.addEventListener('DOMContentLoaded', async () => {
  const user = await WN.requireAuthOrRedirect();
  if (!user) return;
  const avatar = document.querySelector('.user-avatar');
  if (avatar) avatar.textContent = user.full_name.charAt(0).toUpperCase();

  loadSchemes();

  document.getElementById('scheme-category').addEventListener('change', loadSchemes);
});

async function loadSchemes() {
  const container = document.getElementById('scheme-grid');
  container.innerHTML = `<div class="skeleton" style="height:200px;grid-column:1/-1;"></div>`;

  const category = document.getElementById('scheme-category').value;
  const params = new URLSearchParams();
  if (category) params.set('category', category);

  try {
    const res = await WN.api.get(`/schemes?${params.toString()}`, { silent: true });
    const schemes = res.data.schemes;

    if (!schemes.length) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          <h4>No schemes found.</h4>
          <p>Try a different category.</p>
        </div>`;
      return;
    }

    container.innerHTML = schemes.map(s => `
      <div class="scheme-card">
        <span class="badge badge-secondary">${WN.escapeHTML(s.category)}</span>
        <h3 style="margin-top:10px;">${WN.escapeHTML(s.scheme_name)}</h3>
        <div class="scheme-field"><div class="scheme-field-label">Purpose</div><div class="scheme-field-value">${WN.escapeHTML(s.purpose)}</div></div>
        <div class="scheme-field"><div class="scheme-field-label">Who it's for</div><div class="scheme-field-value">${WN.escapeHTML(s.intended_for)}</div></div>
        <div class="scheme-field"><div class="scheme-field-label">Basic Eligibility</div><div class="scheme-field-value">${WN.escapeHTML(s.eligibility)}</div></div>
        <div class="scheme-field"><div class="scheme-field-label">Key Benefits</div><div class="scheme-field-value">${WN.escapeHTML(s.key_benefits)}</div></div>
        <div class="scheme-field"><div class="scheme-field-label">Limitations</div><div class="scheme-field-value">${WN.escapeHTML(s.limitations)}</div></div>
        <div class="scheme-footer">
          <span>Source: ${WN.escapeHTML(s.official_source)}</span>
          <span>Verified: ${WN.formatDate(s.last_verified_date)}</span>
        </div>
        ${s.official_url ? `<a href="${WN.escapeHTML(s.official_url)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm btn-block" style="margin-top:14px;">View Official Website</a>` : ''}
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<p>We could not load government schemes right now. Please try again.</p>`;
  }
}
