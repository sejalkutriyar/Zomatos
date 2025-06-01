import { useState, useEffect } from 'react';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Select, MenuItem, InputLabel, FormControl, Alert, CircularProgress } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import OrderTracker from './OrderTracker';
import './ManagerDashboard.css';

const API = 'http://localhost:5000/api';
const DELIVERY_PARTNERS = [
  { id: 1, name: 'Rider 1' },
  { id: 2, name: 'Rider 2' },
  { id: 3, name: 'Rider 3' },
];

function ManagerDashboard({ logout }) {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [items, setItems] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const res = await fetch(`${API}/orders`);
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  }

  async function addOrder(e) {
    e.preventDefault();
    setError('');
    if (!orderId || !items || !prepTime) {
      setError('All fields required');
      return;
    }
    if (isNaN(Number(prepTime)) || Number(prepTime) <= 0) {
      setError('Prep time must be a positive number');
      return;
    }
    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, items, prepTime })
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.message);
        return;
      }
      setOrderId(''); setItems(''); setPrepTime('');
      fetchOrders();
    } catch (err) {
      setError('Error adding order');
    }
  }

  async function assignPartner(orderId, partnerId) {
    setError('');
    try {
      const res = await fetch(`${API}/orders/${orderId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId })
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.message);
        return;
      }
      fetchOrders();
    } catch (err) {
      setError('Error assigning partner');
    }
  }

  return (
    <div className="manager-dashboard">
      <Typography variant="h4" sx={{ mb: 2 }}>Restaurant Manager Dashboard</Typography>
      <Button onClick={logout} variant="outlined" color="secondary" startIcon={<LogoutIcon />} sx={{ float: 'right', mb: 2 }}>Logout</Button>
      <form onSubmit={addOrder} className="order-form" style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <TextField label="Order ID" value={orderId} onChange={e => setOrderId(e.target.value)} />
        <TextField label="Items" value={items} onChange={e => setItems(e.target.value)} />
        <TextField label="Prep Time (min)" value={prepTime} onChange={e => setPrepTime(e.target.value)} />
        <Button type="submit" variant="contained">Add Order</Button>
      </form>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? <CircularProgress /> : (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Prep Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned Partner</TableCell>
              <TableCell>Dispatch Time</TableCell>
              <TableCell>Assign</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.orderId}>
                <TableCell>{o.orderId}</TableCell>
                <TableCell>{o.items}</TableCell>
                <TableCell>{o.prepTime} min</TableCell>
                <TableCell><OrderTracker status={o.status} /></TableCell>
                <TableCell>{o.assignedPartner ? DELIVERY_PARTNERS.find(p => p.id === o.assignedPartner)?.name : '-'}</TableCell>
                <TableCell>{o.dispatchTime ? o.dispatchTime + ' min' : '-'}</TableCell>
                <TableCell>
                  {o.status === 'PREP' && !o.assignedPartner && (
                    <FormControl fullWidth size="small">
                      <InputLabel>Select</InputLabel>
                      <Select label="Select" onChange={e => assignPartner(o.orderId, Number(e.target.value))} defaultValue="">
                        <MenuItem value="" disabled>Select</MenuItem>
                        {DELIVERY_PARTNERS.filter(p => !orders.some(ord => ord.assignedPartner === p.id && ord.status !== 'DELIVERED')).map(p => (
                          <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {o.assignedPartner && <Typography variant="body2">Assigned</Typography>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      )}
    </div>
  );
}

export default ManagerDashboard;
