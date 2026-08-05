const notesService = require('../services/notes.service');
const { validateNote } = require('../utils/validators');

async function createNote(req, res, next) {
  try {
    const errors = validateNote(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }

    const note = await notesService.createNote({
      userId: req.user.id,
      ...req.body,
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

    const note = await notesService.updateNote(req.params.id, req.user.id, req.body);
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
