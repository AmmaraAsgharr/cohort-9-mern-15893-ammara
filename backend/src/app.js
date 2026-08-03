const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const pino = require('pino');
const pinoHttp = require('pino-http');
const errorHandler = require('../middleware/errorHandler');

dotenv.config();

const logger = pino();
const app = express();

app.use(express.json());
app.use(pinoHttp({ logger }));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Notes App Backend is running!');
});

// Error handling middleware after routes
app.use(errorHandler);

// Database connection & Server startup function
const startServer = async () => {
  // Validate MONGO_URI existence
  if (!process.env.MONGO_URI) {
    logger.error('FATAL: MONGO_URI is not defined in environment variables');
    process.exit(1);
  }
  try {
    // Wait for MongoDB connection before starting the server
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