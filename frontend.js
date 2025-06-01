import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, loginForm);
      setUser(response.data);
    } catch (error) {
      alert('Login failed: ' + error.response?.data?.message);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Update Order Status
  const updateOrderStatus = async (orderId, nextStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, { nextStatus });
      fetchOrders();
    } catch (error) {
      alert('Failed to update status: ' + error.response?.data?.message);
    }
  };

  // Assign Order to Partner
  const assignOrder = async (orderId, partnerId) => {
    try {
      await axios.put(`${API_BASE_URL}/orders/${orderId}/assign`, { partnerId });
      fetchOrders();
    } catch (error) {
      alert('Failed to assign order: ' + error.response?.data?.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <h2>Zomato Ops Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={loginForm.username}
            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h1>Zomato Ops Dashboard</h1>
        <div className="user-info">
          Welcome, {user.username} ({user.role})
          <button onClick={() => setUser(null)}>Logout</button>
        </div>
      </header>

      <main>
        <div className="orders-section">
          <h2>Orders</h2>
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order.orderId} className="order-card">
                <h3>Order #{order.orderId}</h3>
                <p>Items: {order.items}</p>
                <p>Status: {order.status}</p>
                <p>Prep Time: {order.prepTime} mins</p>
                {order.assignedPartner && (
                  <p>Assigned to Partner #{order.assignedPartner}</p>
                )}
                
                {user.role === 'manager' && order.status === 'PREP' && (
                  <div className="assign-section">
                    <button onClick={() => assignOrder(order.orderId, 1)}>Assign to Rider 1</button>
                    <button onClick={() => assignOrder(order.orderId, 2)}>Assign to Rider 2</button>
                    <button onClick={() => assignOrder(order.orderId, 3)}>Assign to Rider 3</button>
                  </div>
                )}

                {user.role === 'partner' && order.assignedPartner === user.partnerId && (
                  <div className="status-update">
                    {order.status === 'PREP' && (
                      <button onClick={() => updateOrderStatus(order.orderId, 'PICKED')}>
                        Mark as Picked
                      </button>
                    )}
                    {order.status === 'PICKED' && (
                      <button onClick={() => updateOrderStatus(order.orderId, 'ON_ROUTE')}>
                        Start Delivery
                      </button>
                    )}
                    {order.status === 'ON_ROUTE' && (
                      <button onClick={() => updateOrderStatus(order.orderId, 'DELIVERED')}>
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// Styles
const styles = `
  .app-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .login-container {
    max-width: 400px;
    margin: 100px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  .login-container form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .login-container input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .login-container button {
    padding: 10px;
    background: #cb202d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .orders-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .order-card {
    border: 1px solid #eee;
    padding: 15px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .assign-section, .status-update {
    margin-top: 15px;
    display: flex;
    gap: 10px;
  }

  button {
    padding: 8px 15px;
    background: #cb202d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #a01824;
  }
`;

// Create and inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); 