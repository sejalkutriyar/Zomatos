import { useState, useEffect } from 'react';
import { 
  Button, Card, CardContent, Typography, 
  Alert, CircularProgress 
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { STATUS_FLOW } from '../../constants';
import { fetchPartnerOrder, updateOrderStatus } from '../../services/api';
import OrderTracker from '../common/OrderTracker';

export default function PartnerDashboard({ user, logout }) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 3000);
    return () => clearInterval(interval);
  }, []);

  async function fetchOrder() {
    setLoading(true);
    try {
      const data = await fetchPartnerOrder(user.partnerId);
      setOrder(data && data.orderId ? data : null);
    } catch (err) {
      setError('Error fetching order');
    }
    setLoading(false);
  }

  async function handleNextStatus() {
    if (!order) return;
    setError('');
    const currentIdx = STATUS_FLOW.indexOf(order.status);
    const next = STATUS_FLOW[currentIdx + 1];
    try {
      await updateOrderStatus(order.orderId, next);
      fetchOrder();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="dashboard">
      <Typography variant="h4" sx={{ mb: 2 }}>Delivery Partner View</Typography>
      <Button 
        onClick={logout} 
        variant="outlined" 
        color="secondary" 
        startIcon={<LogoutIcon />} 
        sx={{ float: 'right', mb: 2 }}
      >
        Logout
      </Button>

      {loading ? <CircularProgress /> : order ? (
        <Card className="order-card" sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
          <CardContent>
            <Typography variant="h6">Assigned Order: {order.orderId}</Typography>
            <Typography>Items: {order.items}</Typography>
            <Typography>Prep Time: {order.prepTime} min</Typography>
            <Typography>Status: <OrderTracker status={order.status} /></Typography>
            <Button 
              onClick={handleNextStatus} 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2 }} 
              disabled={order.status === 'DELIVERED'}
            >
              {order.status === 'DELIVERED' 
                ? 'Order Delivered' 
                : `Mark as ${STATUS_FLOW[STATUS_FLOW.indexOf(order.status)+1]}`}
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