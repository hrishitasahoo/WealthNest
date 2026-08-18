

const WN = (function () {
  const BASE_URL = '/api';

  function getToastStack() {
    let stack = document.querySelector('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    return stack;
  }

  function toast(message, type = 'info') {
    const stack = getToastStack();
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    stack.appendChild(el);
    setTimeout(() => el.remove(), 4200);
  }

  async function request(path, { method = 'GET', body, silent = false } = {}) {
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method,
        credentials: 'include',
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined
      });

      let json;
      try {
        json = await res.json();
      } catch (parseErr) {
        throw new Error('We had trouble reading the server response. Please try again.');
      }

      if (!res.ok) {
        if (res.status === 401 && json.code === 'SESSION_EXPIRED') {
          if (!silent) {
            toast('Your session has expired. Please log in again.', 'error');
            setTimeout(() => { window.location.href = '/login.html'; }, 900);
          }
        } else if (!silent) {
          toast(json.message || 'Something went wrong. Please try again.', 'error');
        }
        const err = new Error(json.message || 'Request failed');
        err.code = json.code;
        err.status = res.status;
        throw err;
      }

      return json;
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        if (!silent) toast('Network error. Please check your connection and try again.', 'error');
      }
      throw err;
    }
  }

  const api = {
    get: (path, opts) => request(path, { method: 'GET', ...opts }),
    post: (path, body, opts) => request(path, { method: 'POST', body, ...opts }),
    put: (path, body, opts) => request(path, { method: 'PUT', body, ...opts }),
    del: (path, opts) => request(path, { method: 'DELETE', ...opts })
  };

  function formatINR(amount) {
    const num = Number(amount) || 0;
    return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
  }

  async function requireAuthOrRedirect() {
    try {
      const res = await api.get('/auth/me', { silent: true });
      return res.data.user;
    } catch (err) {
      window.location.href = '/login.html';
      return null;
    }
  }

  return { api, toast, formatINR, formatDate, escapeHTML, requireAuthOrRedirect };
})();
