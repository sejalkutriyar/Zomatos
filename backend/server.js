const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const Order = require('./models/order');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- Routes ---
app.use('/api', authRoutes);
app.use('/api/orders', orderRoutes);

// --- MongoDB Connection & Server Start ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zomato_ops';

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
