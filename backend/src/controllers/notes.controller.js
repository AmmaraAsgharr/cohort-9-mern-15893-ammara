const sanitizeHtml = require('sanitize-html');
const notesService = require('../services/notes.service');
const { validateNote } = require('../utils/validators');

// Allowlist matches what the frontend's rich-text toolbar can actually produce
// (bold/italic/underline/strike, headings, paragraphs, lists, and inline color).
// Anything outside this (script tags, event-handler attributes, iframes, etc.)
// gets stripped, regardless of what the client sends.
const SANITIZE_OPTIONS = {
  allowedTags: [
    'b', 'i', 'u', 's', 'strong', 'em', 'p', 'h2', 'h3',
    'ul', 'ol', 'li', 'br', 'span', 'div',
  ],
  allowedAttributes: {
    span: ['style'],
    div: ['style'],
  },
  allowedStyles: {
    '*': {
      color: [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/],
    },
  },
  disallowedTagsMode: 'discard',
};

function sanitizeNoteBody(body) {
  if (typeof body.content === 'string') {
    return { ...body, content: sanitizeHtml(body.content, SANITIZE_OPTIONS) };
  }
  return body;
}

async function createNote(req, res, next) {
  try {
    const errors = validateNote(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }

    const note = await notesService.createNote({
      userId: req.user.id,
      ...sanitizeNoteBody(req.body),
    });

    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
}

async function getNotes(req, res, next) {
  try {
    const notes = await notesService.getNotesByUser(req.user.id);
    res.json(notes);
  } catch (err) {
    next(err);
  }
}

async function getNote(req, res, next) {
  try {
    const note = await notesService.getNoteById(req.params.id, req.user.id);
    res.json(note);
  } catch (err) {
    next(err);
  }
}

async function updateNote(req, res, next) {
  try {
    const errors = validateNote(req.body, { partial: true });
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }

    const note = await notesService.updateNote(req.params.id, req.user.id, sanitizeNoteBody(req.body));
    res.json(note);
  } catch (err) {
    next(err);
  }
}

async function deleteNote(req, res, next) {
  try {
    await notesService.deleteNote(req.params.id, req.user.id);
    res.json({ success: true, message: 'Note deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createNote, getNotes, getNote, updateNote, deleteNote };