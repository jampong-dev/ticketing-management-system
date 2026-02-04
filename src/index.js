require('dotenv').config();
const express = require('express');
const initDb = require('./server/models');
const { errorHandler } = require('./server/middleware');
const app = express();

// Middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});


// Routes
const routes = require('./server/routes');

app.use('/api/tickets', routes.ticket);
app.use('/api/auth', routes.auth);

// Database connection
// sequelize.authenticate()
//   .then(() => console.log('Database connected'))
//   .catch(err => console.error('Unable to connect:', err));

(async () => {
  await initDb();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));