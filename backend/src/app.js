const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
//pino http 
const pino = require('pino');
const pinoHttp = require('pino-http');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.routes');
const notesRoutes = require('./routes/notes.routes');

dotenv.config();

const logger = pino();
const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  logger.error('FATAL: CORS_ORIGIN is not defined in environment variables');
  process.exit(1);
}

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(pinoHttp({ logger }));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Notes App Backend is running!');
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Global error handler always last OK!
app.use(errorHandler);

// Database connection & Server startup FUNCYION
const startServer = async () => {
  if (!process.env.MONGO_URI) {
    logger.error('FATAL: MONGO_URI is not defined in environment variables');
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB connected successfully');

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error(err, 'MongoDB connection error');
    process.exit(1);
  }
};

startServer();