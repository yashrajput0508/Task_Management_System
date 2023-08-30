const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import route modules
const adminDashboardRoutes = require('./taskRoutes');
const memberRoutes = require('./memberRoutes');
const taskSubmissionRoutes = require('./taskSubmissonRoutes');

// Use route modules
app.use('/tasks', adminDashboardRoutes);
app.use('/members', memberRoutes);
app.use('/tasksubmission',taskSubmissionRoutes)

// Start the server
app.listen(8082, () => {
  console.log('Server is running on port 8082');
});