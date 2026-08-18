document.addEventListener('DOMContentLoaded', async () => {
  const user = await WN.requireAuthOrRedirect();
  if (!user) return;

  document.querySelector('.user-avatar').textContent = user.full_name.charAt(0).toUpperCase();
  document.getElementById('fullName').value = user.full_name;
  document.getElementById('username').value = user.username || '';
  document.getElementById('email').value = user.email;

  const params = new URLSearchParams(window.location.search);
  if (params.get('welcome')) {
    document.getElementById('welcome-banner').style.display = 'flex';
  }

  await loadFinancialProfile();

  document.getElementById('account-form').addEventListener('submit', handleAccountSubmit);
  document.getElementById('password-form').addEventListener('submit', handlePasswordSubmit);
  document.getElementById('profile-form').addEventListener('submit', handleProfileSubmit);
});

function showMessage(el, message) {
  el.textContent = message;
  el.classList.add('visible');
}
function hideMessage(el) {
  el.classList.remove('visible');
  el.textContent = '';
}

async function handleAccountSubmit(e) {
  e.preventDefault();
  const errorEl = document.getElementById('account-error');
  const successEl = document.getElementById('account-success');
  hideMessage(errorEl);
  hideMessage(successEl);

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving…';

  const payload = {
    username: document.getElementById('username').value.trim(),
    email: document.getElementById('email').value.trim()
  };

  try {
    await WN.api.put('/account', payload, { silent: true });
    showMessage(successEl, 'Your account details have been updated.');
  } catch (err) {
    showMessage(errorEl, err.message || 'We could not update your account details. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save Account Details';
  }
}

async function handlePasswordSubmit(e) {
  e.preventDefault();
  const errorEl = document.getElementById('password-error');
  const successEl = document.getElementById('password-success');
  hideMessage(errorEl);
  hideMessage(successEl);

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Updating…';

  const payload = {
    currentPassword: document.getElementById('currentPassword').value,
    newPassword: document.getElementById('newPassword').value,
    confirmNewPassword: document.getElementById('confirmNewPassword').value
  };

  try {
    await WN.api.put('/account/password', payload, { silent: true });
    showMessage(successEl, 'Your password has been updated.');
    document.getElementById('password-form').reset();
  } catch (err) {
    showMessage(errorEl, err.message || 'We could not update your password. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Update Password';
  }
}

async function loadFinancialProfile() {
  try {
    const res = await WN.api.get('/profile', { silent: true });
    const p = res.data.profile;
    if (!p) return;

    document.getElementById('age').value = p.age ?? '';
    document.getElementById('monthlyIncome').value = p.monthly_income ?? '';
    document.getElementById('monthlyExpenses').value = p.monthly_expenses ?? '';
    document.getElementById('currentSavings').value = p.current_savings ?? '';
    document.getElementById('existingInvestments').value = p.existing_investments ?? '';
    document.getElementById('monthlySavingCapacity').value = p.monthly_saving_capacity ?? '';
    document.getElementById('mainFinancialGoal').value = p.main_financial_goal ?? '';
  } catch (err) {  }
}

async function handleProfileSubmit(e) {
  e.preventDefault();
  const successEl = document.getElementById('finprofile-success');
  hideMessage(successEl);

  const payload = {
    age: document.getElementById('age').value || null,
    monthlyIncome: document.getElementById('monthlyIncome').value || null,
    monthlyExpenses: document.getElementById('monthlyExpenses').value || null,
    currentSavings: document.getElementById('currentSavings').value || null,
    existingInvestments: document.getElementById('existingInvestments').value || null,
    monthlySavingCapacity: document.getElementById('monthlySavingCapacity').value || null,
    mainFinancialGoal: document.getElementById('mainFinancialGoal').value.trim() || null
  };

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving…';

  try {
    await WN.api.put('/profile', payload, { silent: true });
    showMessage(successEl, 'Your financial profile has been updated.');
  } catch (err) {
    WN.toast(err.message || 'We could not save your financial profile.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save Financial Profile';
  }
}

function skipForNow() {
  window.location.href = '/dashboard.html';
}
