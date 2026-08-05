const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const { NOTE_COLORS } = require('../models/note.model');

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function validateSignup(body = {}) {
  const errors = [];
  const { name, email, password } = body;

  if (!isNonEmptyString(name)) errors.push('Name is required.');
  else if (name.trim().length > 80) errors.push('Name must be 80 characters or fewer.');
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

function validateNote(body = {}, { partial = false } = {}) {
  const errors = [];
  const { title, content, color, tags, pinned, wordCount } = body;

  if (!partial || title !== undefined) {
    if (title !== undefined && typeof title !== 'string') errors.push('Title must be a string.');
    else if (title && title.trim().length > 200) errors.push('Title must be 200 characters or fewer.');
  }

  if (!partial || content !== undefined) {
    if (content !== undefined && typeof content !== 'string') errors.push('Content must be a string.');
  }

  if (color !== undefined && !NOTE_COLORS.includes(color)) {
    errors.push(`Color must be one of: ${NOTE_COLORS.join(', ')}.`);
  }

  if (tags !== undefined) {
    if (!Array.isArray(tags) || !tags.every((t) => typeof t === 'string')) {
      errors.push('Tags must be an array of strings.');
    }
  }

  if (pinned !== undefined && typeof pinned !== 'boolean') {
    errors.push('Pinned must be a boolean.');
  }

  if (wordCount !== undefined && (typeof wordCount !== 'number' || wordCount < 0)) {
    errors.push('Word count must be a non-negative number.');
  }

  return errors;
}

module.exports = { validateSignup, validateLogin, validateNote, isNonEmptyString };