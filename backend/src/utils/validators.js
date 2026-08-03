const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function validateSignup(body = {}) {
  const errors = [];
  const { name, email, password } = body;

  if (!isNonEmptyString(name)) errors.push('Name is required.');
  if (!isNonEmptyString(email) || !EMAIL_RE.test(email.trim())) errors.push('A valid email is required.');
  if (!isNonEmptyString(password) || password.length < 6) errors.push('Password must be at least 6 characters.');

  return errors;
}

function validateLogin(body = {}) {
  const errors = [];
  const { email, password } = body;

  if (!isNonEmptyString(email)) errors.push('Email is required.');
  if (!isNonEmptyString(password)) errors.push('Password is required.');

  return errors;
}

module.exports = { validateSignup, validateLogin, isNonEmptyString };