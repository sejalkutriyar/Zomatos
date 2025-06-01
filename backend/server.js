<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const Order = require('./models/order');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
=======
// Zomato Ops Pro – Smart Kitchen + Delivery Hub (MERN Backend)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
>>>>>>> 866211a1a8d67d0e6580f2ef93b5b16984bff983

// Import routes
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

// Import database connection
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

<<<<<<< HEAD
// --- Routes ---
app.use('/api', authRoutes);
app.use('/api/orders', orderRoutes);

// --- MongoDB Connection & Server Start ---
=======
// Routes
app.use('/api/orders', orderRoutes);
app.use('/api', authRoutes);

// Connect to MongoDB and start server
>>>>>>> 866211a1a8d67d0e6580f2ef93b5b16984bff983
const PORT = process.env.PORT || 5000;

<<<<<<< HEAD
mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
=======
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
});
>>>>>>> 866211a1a8d67d0e6580f2ef93b5b16984bff983
