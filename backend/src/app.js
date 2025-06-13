const express = require('express');
const cors = require('cors');
const config = require('./config');
const reportsRoutes = require('./routes/reports.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/reports', reportsRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
}); 