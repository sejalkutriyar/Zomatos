const Order = require('../models/Order');

// Status flow for order progression
const statusFlow = ['PREP', 'PICKED', 'ON_ROUTE', 'DELIVERED'];

// Create new order
exports.createOrder = async (req, res) => {
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
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
};

// Assign order to partner
exports.assignOrder = async (req, res) => {
  const { partnerId } = req.body;
  const { orderId } = req.params;
  
  // Prevent assigning same rider twice
  const assigned = await Order.findOne({ 
    assignedPartner: partnerId, 
    status: { $ne: 'DELIVERED' } 
  });
  
  if (assigned) {
    return res.status(400).json({ message: 'Partner already assigned to another order' });
  }
  
  const order = await Order.findOne({ orderId });
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  if (order.status !== 'PREP') {
    return res.status(400).json({ message: 'Order not in PREP status' });
  }
  
  order.assignedPartner = partnerId;
  order.dispatchTime = order.prepTime + order.eta;
  await order.save();
  res.json(order);
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { nextStatus } = req.body;
  
  const order = await Order.findOne({ orderId });
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
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
};

// Get order for specific partner
exports.getPartnerOrder = async (req, res) => {
  const { partnerId } = req.params;
  const order = await Order.findOne({ 
    assignedPartner: Number(partnerId), 
    status: { $ne: 'DELIVERED' } 
  });
  res.json(order || {});
}; 