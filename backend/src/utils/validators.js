const EMAIL_RE = /^[^\s@.]+@[^\s@.]+(?:\.[^\s@.]+)+$/;
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

function validateTitle(title) {
  if (typeof title !== 'string') return 'Title must be a string.';
  if (title.trim().length > 200) return 'Title must be 200 characters or fewer.';
  return null;
}

function validateContent(content) {
  if (typeof content !== 'string') return 'Content must be a string.';
  return null;
}

function validateColor(color) {
  if (!NOTE_COLORS.includes(color)) {
    return `Color must be one of: ${NOTE_COLORS.join(', ')}.`;
  }
  return null;
}

function validateTags(tags) {
  if (!Array.isArray(tags) || !tags.every(t => typeof t === 'string')) {
    return 'Tags must be an array of strings.';
  }
  return null;
}

function validatePinned(pinned) {
  if (typeof pinned !== 'boolean') return 'Pinned must be a boolean.';
  return null;
}

function validateWordCount(wordCount) {
  if (typeof wordCount !== 'number' || wordCount < 0) {
    return 'Word count must be a non-negative number.';
  }
  return null;
}
 
function validateNote(body = {}, { partial = false } = {}) {
  const errors = [];
  const { title, content, color, tags, pinned, wordCount } = body;

  // Title
  if (!partial || title !== undefined) {
    const err = validateTitle(title);
    if (err) errors.push(err);
  }

  // Content
  if (!partial || content !== undefined) {
    const err = validateContent(content);
    if (err) errors.push(err);
  }

  // Color
  if (color !== undefined) {
    const err = validateColor(color);
    if (err) errors.push(err);
  }

  // Tags
  if (tags !== undefined) {
    const err = validateTags(tags);
    if (err) errors.push(err);
  }

  // Pinned
  if (pinned !== undefined) {
    const err = validatePinned(pinned);
    if (err) errors.push(err);
  }

  // WordCount
  if (wordCount !== undefined) {
    const err = validateWordCount(wordCount);
    if (err) errors.push(err);
  }

  return errors;
}

module.exports = { validateSignup, validateLogin, validateNote, isNonEmptyString };