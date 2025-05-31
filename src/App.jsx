import { useState, useEffect } from 'react'
import './ZomatoPro.css'
import foodImg from './assets/food.jpg';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, Typography, Select, MenuItem, InputLabel, FormControl, Alert, CircularProgress } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const API = 'http://localhost:5000/api';
const DELIVERY_PARTNERS = [
  { id: 1, name: 'Rider 1' },
  { id: 2, name: 'Rider 2' },
  { id: 3, name: 'Rider 3' },
];
const STATUS_FLOW = ['PREP', 'PICKED', 'ON_ROUTE', 'DELIVERED'];

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      onLogin(data);
    } catch (err) {
      setError('Invalid credentials');
    }
  }

  return (
    <Card className="login-container" sx={{ maxWidth: 400, mx: 'auto', mt: 6, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Zomato Ops Pro Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Username" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
          <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>Login</Button>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          <b>Manager:</b> manager / manager123<br/>
          <b>Rider:</b> rider1 / rider123, rider2 / rider123, rider3 / rider123
        </Typography>
      </CardContent>
    </Card>
  );
}

function ManagerDashboard({ logout }) {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [items, setItems] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Polling for real-time updates every 3 seconds
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
  useEffect(() => { fetchOrders(); }, []);

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
    <div className="dashboard">
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

function PartnerDashboard({ user, logout }) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Polling for real-time updates every 3 seconds
  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 3000);
    return () => clearInterval(interval);
  }, []);

  async function fetchOrder() {
    setLoading(true);
    const res = await fetch(`${API}/partner/${user.partnerId}/order`);
    const data = await res.json();
    setOrder(data && data.orderId ? data : null);
    setLoading(false);
  }
  useEffect(() => { fetchOrder(); }, []);

  async function nextStatus() {
    if (!order) return;
    setError('');
    const currentIdx = STATUS_FLOW.indexOf(order.status);
    const next = STATUS_FLOW[currentIdx + 1];
    try {
      const res = await fetch(`${API}/orders/${order.orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nextStatus: next })
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.message);
        return;
      }
      fetchOrder();
    } catch (err) {
      setError('Error updating status');
    }
  }

  return (
    <div className="dashboard">
      <Typography variant="h4" sx={{ mb: 2 }}>Delivery Partner View</Typography>
      <Button onClick={logout} variant="outlined" color="secondary" startIcon={<LogoutIcon />} sx={{ float: 'right', mb: 2 }}>Logout</Button>
      {loading ? <CircularProgress /> : order ? (
        <Card className="order-card" sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
          <CardContent>
            <Typography variant="h6">Assigned Order: {order.orderId}</Typography>
            <Typography>Items: {order.items}</Typography>
            <Typography>Prep Time: {order.prepTime} min</Typography>
            <Typography>Status: <OrderTracker status={order.status} /></Typography>
            <Button onClick={nextStatus} variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={order.status === 'DELIVERED'}>
              {order.status === 'DELIVERED' ? 'Order Delivered' : `Mark as ${STATUS_FLOW[STATUS_FLOW.indexOf(order.status)+1]}`}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Alert severity="info" sx={{ mt: 4 }}>No assigned order. You are available.</Alert>
      )}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </div>
  );
}

function OrderTracker({ status }) {
  return (
    <div className="order-tracker" style={{ display: 'flex', gap: 8 }}>
      {STATUS_FLOW.map(s => (
        <span key={s} className={s === status ? 'active' : ''} style={{
          padding: '2px 10px',
          borderRadius: 8,
          background: s === status ? '#1976d2' : '#e0e0e0',
          color: s === status ? '#fff' : '#333',
          fontWeight: s === status ? 600 : 400,
          fontSize: 13
        }}>{s}</span>
      ))}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  function logout() {
    setUser(null);
  }

  return (
    <div className="main-app">
      <div className="header" style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', boxShadow: '0 2px 8px #eee', padding: 16, borderRadius: 12, margin: 16 }}>
        <img src={foodImg} alt="Food" className="header-img" style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover', boxShadow: '0 2px 8px #ccc' }} />
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#d32f2f' }}>Zomato Ops Pro – Smart Kitchen + Delivery Hub</Typography>
      </div>
      {!user && <Login onLogin={setUser} />}
      {user && user.role === 'manager' && (
        <ManagerDashboard logout={logout} />
      )}
      {user && user.role === 'partner' && (
        <PartnerDashboard user={user} logout={logout} />
      )}
    </div>
  );
}

export default App
