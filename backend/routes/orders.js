// routes/orders.js
const express = require('express');
const Order = require('../models/order');
const router = express.Router();

// --- Orders CRUD & Assignment ---
// Advanced: Prevent duplicate orderId, validate partner workload, and log actions
router.post('/', async (req, res) => {
  const { orderId, items, prepTime } = req.body;
  if (!orderId || !items || !prepTime || isNaN(Number(prepTime)) || Number(prepTime) <= 0) {
    return res.status(400).json({ message: 'Invalid order data' });
  }
  try {
    // Prevent duplicate orderId
    const exists = await Order.findOne({ orderId });
    if (exists) return res.status(400).json({ message: 'Order ID must be unique' });
    const order = new Order({ orderId, items, prepTime });
    await order.save();
    res.json(order);
  } catch (e) {
    res.status(400).json({ message: 'Order creation failed' });
  }
});

// Advanced: List all orders, optionally filter by status or partner
router.get('/', async (req, res) => {
  const { status, partnerId } = req.query;
  let query = {};
  if (status) query.status = status;
  if (partnerId) query.assignedPartner = Number(partnerId);
  const orders = await Order.find(query);
  res.json(orders);
});

// Advanced: Assign partner with workload validation
router.put('/:orderId/assign', async (req, res) => {
  const { partnerId } = req.body;
  const { orderId } = req.params;
  // Prevent assigning same rider twice (workload validation)
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

// --- Update Order Status (sequential, advanced validation) ---
const statusFlow = ['PREP', 'PICKED', 'ON_ROUTE', 'DELIVERED'];
router.put('/:orderId/status', async (req, res) => {
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

// --- Get Orders for Partner (advanced: show all active orders for a partner) ---
router.get('/partner/:partnerId/order', async (req, res) => {
  const { partnerId } = req.params;
  // Return all active (not delivered) orders for this partner
  const orders = await Order.find({ assignedPartner: Number(partnerId), status: { $ne: 'DELIVERED' } });
  res.json(orders);
});

module.exports = router;
