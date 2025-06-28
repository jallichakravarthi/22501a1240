const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const loggerMiddleware = require('../Logger Middleware/loggerMiddleware'); // Adjust the path
const urlRoutes = require('./routes/urlRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(express.json());

// Loging every incoming request
app.use(async (req, res, next) => {
  // Loging incoming requests
  await loggerMiddleware({
    body: {
      stack: 'backend',
      level: 'info',
      package: 'service',
      message: `Incoming ${req.method} request to ${req.originalUrl}`,
    },
  }, {}, () => {});
  next();
});

// Routes
app.use('/', urlRoutes);

// Root health check
app.get('/health', (req, res) => {
  res.send('Backend is live and healthy!');
});

// MongoDB Connection & Server Start
const PORT = process.env.PORT || 5051;
const MONGO_URI = process.env.MONGO_URI ||'mongodb://127.0.0.1:27017/url-shortener';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch(async (err) => {
    console.error('MongoDB connection error:', err);
    await loggerMiddleware({
      body: {
        stack: 'backend',
        level: 'error',
        package: 'service',
        message: `MongoDB connection failed: ${err.message}`,
      },
    }, {}, () => {});
  });
