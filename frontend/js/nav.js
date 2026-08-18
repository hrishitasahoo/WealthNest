

const APP_NAV_LINKS = [
  { href: 'dashboard.html', label: 'Dashboard', key: 'dashboard' },
  { href: 'expenses.html', label: 'Expenses', key: 'expenses' },
  { href: 'budget.html', label: 'Budget', key: 'budget' },
  { href: 'goals.html', label: 'Goals', key: 'goals' },
  { href: 'savings.html', label: 'Savings', key: 'savings' },
  { href: 'tools.html', label: 'Financial Tools', key: 'tools' },
  { href: 'learn.html', label: 'Learn', key: 'learn' },
  { href: 'schemes.html', label: 'Schemes', key: 'schemes' },
  { href: 'settings.html', label: 'Settings', key: 'settings' }
];

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .sidebar-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.split('/').pop() === currentPage) {
      link.classList.add('active');
    }
  });

  const navLinksSlot = document.querySelector('[data-nav-links]');
  const headerUserSlot = document.querySelector('[data-header-user]');

  if ((navLinksSlot || headerUserSlot) && window.WN) {
    WN.api.get('/auth/me', { silent: true })
      .then(res => {
        const user = res.data.user;

        if (headerUserSlot) {
          headerUserSlot.innerHTML = `
            <a href="dashboard.html" class="btn btn-secondary btn-sm">Dashboard</a>
            <div class="user-avatar" title="${WN.escapeHTML(user.full_name)}">${WN.escapeHTML(user.full_name.charAt(0).toUpperCase())}</div>
          `;
        }

        if (navLinksSlot) {
          const currentKey = navLinksSlot.dataset.navLinks;
          navLinksSlot.innerHTML = APP_NAV_LINKS.map(link =>
            `<a href="${link.href}"${link.key === currentKey ? ' class="active"' : ''}>${link.label}</a>`
          ).join('');
        }
      })
      .catch(() => {
        if (headerUserSlot) {
          headerUserSlot.innerHTML = `
            <a href="login.html" class="btn btn-secondary btn-sm">Login</a>
            <a href="register.html" class="btn btn-primary btn-sm">Get Started</a>
          `;
        }

      });
  }

  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await WN.api.post('/auth/logout');
      } catch (err) {  }
      window.location.href = '/index.html';
    });
  });
});
