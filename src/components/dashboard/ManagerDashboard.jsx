import { useState, useEffect } from 'react';
import { 
  Button, TextField, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, 
  Typography, Select, MenuItem, InputLabel, 
  FormControl, Alert, CircularProgress 
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { DELIVERY_PARTNERS } from '../../constants';
import { fetchOrders, addOrder, assignPartner } from '../../services/api';
import OrderTracker from '../common/OrderTracker';

export default function ManagerDashboard({ logout }) {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [items, setItems] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrdersData();
    const interval = setInterval(fetchOrdersData, 3000);
    return () => clearInterval(interval);
  }, []);

  async function fetchOrdersData() {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      setError('Error fetching orders');
    }
    setLoading(false);
  }

  async function handleAddOrder(e) {
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
      await addOrder({ orderId, items, prepTime });
      setOrderId(''); 
      setItems(''); 
      setPrepTime('');
      fetchOrdersData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAssignPartner(orderId, partnerId) {
    setError('');
    try {
      await assignPartner(orderId, partnerId);
      fetchOrdersData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="dashboard">
      <Typography variant="h4" sx={{ mb: 2 }}>Restaurant Manager Dashboard</Typography>
      <Button 
        onClick={logout} 
        variant="outlined" 
        color="secondary" 
        startIcon={<LogoutIcon />} 
        sx={{ float: 'right', mb: 2 }}
      >
        Logout
      </Button>

      <form onSubmit={handleAddOrder} className="order-form" style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <TextField 
          label="Order ID" 
          value={orderId} 
          onChange={e => setOrderId(e.target.value)} 
        />
        <TextField 
          label="Items" 
          value={items} 
          onChange={e => setItems(e.target.value)} 
        />
        <TextField 
          label="Prep Time (min)" 
          value={prepTime} 
          onChange={e => setPrepTime(e.target.value)} 
        />
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
                  <TableCell>
                    {o.assignedPartner ? DELIVERY_PARTNERS.find(p => p.id === o.assignedPartner)?.name : '-'}
                  </TableCell>
                  <TableCell>{o.dispatchTime ? o.dispatchTime + ' min' : '-'}</TableCell>
                  <TableCell>
                    {o.status === 'PREP' && !o.assignedPartner && (
                      <FormControl fullWidth size="small">
                        <InputLabel>Select</InputLabel>
                        <Select 
                          label="Select" 
                          onChange={e => handleAssignPartner(o.orderId, Number(e.target.value))} 
                          defaultValue=""
                        >
                          <MenuItem value="" disabled>Select</MenuItem>
                          {DELIVERY_PARTNERS
                            .filter(p => !orders.some(ord => ord.assignedPartner === p.id && ord.status !== 'DELIVERED'))
                            .map(p => (
                              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                            ))
                          }
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