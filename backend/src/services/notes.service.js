const { Note } = require('../models/note.model');
const { ApiError } = require('./auth.service');

function calculateWordCount(content) {
  return content.trim().split(/\s+/).filter((word) => word.length > 0).length;
}

async function createNote({ userId, title, content, color, tags }) {
  try {
    const wordCount = calculateWordCount(content);

    const note = await Note.create({
      userId,
      title: title || 'Untitled',
      content,
      color,
      tags: tags || [],
      wordCount,
    });

    return note;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, 'Failed to create note.');
  }
}

async function getNotesByUser(userId) {
  try {
    const notes = await Note.find({ userId }).sort({ createdAt: -1 });
    return notes;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, 'Failed to fetch notes.');
  }
}

async function getNoteById(noteId, userId) {
  try {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new ApiError(404, 'Note not found.');
    }

    if (note.userId.toString() !== userId.toString()) {
      throw new ApiError(403, 'You do not have permission to access this note.');
    }

    return note;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, 'Failed to fetch note.');
  }
}

async function updateNote(noteId, userId, updates) {
  try {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new ApiError(404, 'Note not found.');
    }

    if (note.userId.toString() !== userId.toString()) {
      throw new ApiError(403, 'You do not have permission to update this note.');
    }

    if (updates.content !== undefined) {
      updates.wordCount = calculateWordCount(updates.content);
    }

    const updated = await Note.findByIdAndUpdate(noteId, updates, { new: true });
    return updated;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, 'Failed to update note.');
  }
}

async function deleteNote(noteId, userId) {
  try {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new ApiError(404, 'Note not found.');
    }

    if (note.userId.toString() !== userId.toString()) {
      throw new ApiError(403, 'You do not have permission to delete this note.');
    }

    await Note.findByIdAndDelete(noteId);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, 'Failed to delete note.');
  }
}

module.exports = { createNote, getNotesByUser, getNoteById, updateNote, deleteNote, calculateWordCount };