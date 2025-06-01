import { API } from '../constants';

// Authentication
export const login = async (username, password) => {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json();
};

// Order Management
export const fetchOrders = async () => {
  const res = await fetch(`${API}/orders`);
  return res.json();
};

export const addOrder = async (orderData) => {
  const res = await fetch(`${API}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }
  return res.json();
};

export const assignPartner = async (orderId, partnerId) => {
  const res = await fetch(`${API}/orders/${orderId}/assign`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ partnerId })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }
  return res.json();
};

export const updateOrderStatus = async (orderId, nextStatus) => {
  const res = await fetch(`${API}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nextStatus })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }
  return res.json();
};

export const fetchPartnerOrder = async (partnerId) => {
  const res = await fetch(`${API}/partner/${partnerId}/order`);
  return res.json();
}; 