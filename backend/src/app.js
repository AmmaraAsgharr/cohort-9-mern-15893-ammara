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

mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB connected successfully'))
  .catch((err) => logger.error(err, 'MongoDB connection error'));

app.get('/', (req, res) => {
  res.send('Notes App Backend is running!');
});

// Error handling middleware after routes
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});