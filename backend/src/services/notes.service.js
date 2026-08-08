const { Note } = require('../models/note.model');
const { ApiError } = require('./auth.service');


function calculateWordCount(content) {
  return (content ?? '').trim().split(/\s+/).filter((word) => word.length > 0).length;
}

async function createNote({ userId, title, content, color, tags ,pinned}) {
  try {
    const wordCount = calculateWordCount(content);

    const note = await Note.create({
  userId,
  title: title || 'Untitled',
  content : content ?? '',
  color,
  tags: tags || [],
  pinned: pinned ?? false,
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

    // Only allow updating specific fields, exclude wordCount from client input
    const allowedFields = ['title', 'content', 'color', 'tags', 'pinned'];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });

    // Recalculate wordCount only if content is being updated
    if (updates.content !== undefined) {
      updateData.wordCount = calculateWordCount(updates.content);
    }

    const updated = await Note.findByIdAndUpdate(noteId, updateData, { new: true });
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