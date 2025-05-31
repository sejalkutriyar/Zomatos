// Zomato Ops Pro – Smart Kitchen + Delivery Hub (MERN Backend)
// Entry point for Express server

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- In-memory users for demo ---
const users = [
  { username: 'manager', password: 'manager123', role: 'manager' },
  { username: 'rider1', password: 'rider123', role: 'partner', partnerId: 1 },
  { username: 'rider2', password: 'rider123', role: 'partner', partnerId: 2 },
  { username: 'rider3', password: 'rider123', role: 'partner', partnerId: 3 },
];

// --- MongoDB Models ---
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  items: String,
  prepTime: Number,
  status: { type: String, enum: ['PREP', 'PICKED', 'ON_ROUTE', 'DELIVERED'], default: 'PREP' },
  assignedPartner: { type: Number, default: null },
  dispatchTime: { type: Number, default: null },
  eta: { type: Number, default: 10 }, // static ETA for demo
});
const Order = mongoose.model('Order', orderSchema);

// --- Auth Route ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ username: user.username, role: user.role, partnerId: user.partnerId });
});

// --- Orders CRUD & Assignment ---
app.post('/api/orders', async (req, res) => {
  const { orderId, items, prepTime } = req.body;
  if (!orderId || !items || !prepTime || isNaN(Number(prepTime)) || Number(prepTime) <= 0) {
    return res.status(400).json({ message: 'Invalid order data' });
  }
  try {
    const order = new Order({ orderId, items, prepTime });
    await order.save();
    res.json(order);
  } catch (e) {
    res.status(400).json({ message: 'Order ID must be unique' });
  }
});

app.get('/api/orders', async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

app.put('/api/orders/:orderId/assign', async (req, res) => {
  const { partnerId } = req.body;
  const { orderId } = req.params;
  // Prevent assigning same rider twice
  const assigned = await Order.findOne({ assignedPartner: partnerId, status: { $ne: 'DELIVERED' } });
  if (assigned) return res.status(400).json({ message: 'Partner already assigned to another order' });
  const order = await Order.findOne({ orderId });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.status !== 'PREP') return res.status(400).json({ message: 'Order not in PREP status' });
  order.assignedPartner = partnerId;
  order.dispatchTime = order.prepTime + order.eta;
  await order.save();
  res.json(order);
});

// --- Update Order Status (sequential) ---
const statusFlow = ['PREP', 'PICKED', 'ON_ROUTE', 'DELIVERED'];
app.put('/api/orders/:orderId/status', async (req, res) => {
  const { orderId } = req.params;
  const { nextStatus } = req.body;
  const order = await Order.findOne({ orderId });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  const currentIdx = statusFlow.indexOf(order.status);
  if (currentIdx === -1 || currentIdx === statusFlow.length - 1) {
    return res.status(400).json({ message: 'Order already delivered or invalid status' });
  }
  if (statusFlow[currentIdx + 1] !== nextStatus) {
    return res.status(400).json({ message: 'Invalid status flow' });
  }
  order.status = nextStatus;
  await order.save();
  res.json(order);
});

// --- Get Orders for Partner ---
app.get('/api/partner/:partnerId/order', async (req, res) => {
  const { partnerId } = req.params;
  const order = await Order.findOne({ assignedPartner: Number(partnerId), status: { $ne: 'DELIVERED' } });
  res.json(order || {});
});

// --- MongoDB Connection & Server Start ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zomato_ops';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
