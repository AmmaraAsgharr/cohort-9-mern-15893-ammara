const mongoose = require('mongoose');

const NOTE_COLORS = ['#FFA500', '#FF69B4', '#00CED1', '#87CEEB', '#DDA0DD', '#8B4513'];

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      trim: true,
      default: 'Untitled',
    },
    content: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      enum: NOTE_COLORS,
      default: NOTE_COLORS[0],
    },
    tags: {
      type: [String],
      default: [],
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = {
  Note: mongoose.model('Note', noteSchema),
  NOTE_COLORS,
};