

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

  const forgotForm = document.getElementById('forgot-password-form');
  if (forgotForm) {
    const errorBox = document.getElementById('forgot-error');
    const successBox = document.getElementById('forgot-success');
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError(errorBox);
      successBox.classList.remove('visible');

      const submitBtn = forgotForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      const payload = { email: document.getElementById('email').value.trim() };

      try {
        const res = await WN.api.post('/auth/forgot-password', payload, { silent: true });
        successBox.textContent = res.message || 'If an account with that email exists, a password reset link has been sent.';
        successBox.classList.add('visible');
        forgotForm.reset();
      } catch (err) {
        showError(errorBox, err.message || 'We could not process that request. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Reset Link';
      }
    });
  }

  const resetForm = document.getElementById('reset-password-form');
  if (resetForm) {
    const errorBox = document.getElementById('reset-error');
    const successBox = document.getElementById('reset-success');
    const token = new URLSearchParams(window.location.search).get('token');

    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError(errorBox);
      successBox.classList.remove('visible');

      if (!token) {
        showError(errorBox, 'This reset link is invalid or has expired. Please request a new one.');
        return;
      }

      const submitBtn = resetForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Resetting…';

      const payload = {
        token,
        newPassword: document.getElementById('newPassword').value,
        confirmNewPassword: document.getElementById('confirmNewPassword').value
      };

      try {
        const res = await WN.api.post('/auth/reset-password', payload, { silent: true });
        successBox.textContent = res.message || 'Your password has been reset. You can now log in.';
        successBox.classList.add('visible');
        resetForm.reset();
        setTimeout(() => { window.location.href = '/login.html'; }, 2000);
      } catch (err) {
        showError(errorBox, err.message || 'We could not reset your password. Please request a new link.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Reset Password';
      }
    });
  }
});
