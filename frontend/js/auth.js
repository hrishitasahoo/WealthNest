

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  function showError(el, message) {
    el.textContent = message;
    el.classList.add('visible');
  }
  function hideError(el) {
    el.classList.remove('visible');
    el.textContent = '';
  }

  if (loginForm) {
    const errorBox = document.getElementById('login-error');
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError(errorBox);

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Logging in…';

      const payload = {
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
      };

      try {
        await WN.api.post('/auth/login', payload, { silent: true });
        window.location.href = '/dashboard.html';
      } catch (err) {
        showError(errorBox, err.message || 'Incorrect email or password.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Log In';
      }
    });
  }

  if (registerForm) {
    const errorBox = document.getElementById('register-error');
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError(errorBox);

      const submitBtn = registerForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account…';

      const payload = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value
      };

      try {
        await WN.api.post('/auth/register', payload, { silent: true });
        window.location.href = '/settings.html?welcome=1';
      } catch (err) {
        showError(errorBox, err.message || 'We could not create your account. Please check your details.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }
    });
  }
});
