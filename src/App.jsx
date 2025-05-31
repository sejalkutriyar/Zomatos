import { useState } from 'react'
import './App.css';
import Header from './components/layout/Header';
import Login from './components/auth/Login';
import ManagerDashboard from './components/dashboard/ManagerDashboard';
import PartnerDashboard from './components/dashboard/PartnerDashboard';
import foodImg from './assets/food.jpg';
import zomatoLogo from './assets/zomato-logo.svg';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, Typography, Select, MenuItem, InputLabel, FormControl, Alert, CircularProgress } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const API = 'http://localhost:5000/api';
const DELIVERY_PARTNERS = [
  { id: 1, name: 'Rider 1' },
  { id: 2, name: 'Rider 2' },
  { id: 3, name: 'Rider 3' },
];
const STATUS_FLOW = ['PREP', 'PICKED', 'ON_ROUTE', 'DELIVERED'];

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
      <Header />
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
