const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  items: String,
  prepTime: Number,
  status: { 
    type: String, 
    enum: ['PREP', 'PICKED', 'ON_ROUTE', 'DELIVERED'], 
    default: 'PREP' 
  },
  assignedPartner: { type: Number, default: null },
  dispatchTime: { type: Number, default: null },
  eta: { type: Number, default: 10 }, // static ETA for demo
});

module.exports = mongoose.model('Order', orderSchema); 