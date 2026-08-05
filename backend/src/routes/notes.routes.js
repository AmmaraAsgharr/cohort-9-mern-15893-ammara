const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { createNote, getNotes, getNote, updateNote, deleteNote } = require('../controllers/notes.controller');

const router = express.Router();

// All notes routes require authentication
router.use(authMiddleware);
 // Create note
router.post('/', createNote);
// Get all user's notes
router.get('/', getNotes); 
// Get specific note
router.get('/:id', getNote); 
// Update note
router.put('/:id', updateNote); 
// Delete note
router.delete('/:id', deleteNote); 

module.exports = router;