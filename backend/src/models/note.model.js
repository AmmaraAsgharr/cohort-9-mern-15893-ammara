const mongoose = require('mongoose');
const NOTE_COLORS = ['#FF6B00', '#FFB830', '#34C77B', '#38AAFF', '#8B5CF6', '#FF4444'];

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