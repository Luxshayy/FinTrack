const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://fintrack-frontend-tjot.onrender.com'
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('FinTrack server is running');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/insights', require('./routes/insights'));

// Serve React build if present
const frontendDist = path.join(__dirname, 'frontend', 'dist');

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(frontendDist, 'index.html'));
    }

    return next();
  });
}

module.exports = app;
