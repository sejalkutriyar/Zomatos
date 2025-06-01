import { useState } from 'react';
import Login from './components/Login';
import ManagerDashboard from './components/ManagerDashboard';
import PartnerDashboard from './components/PartnerDashboard';
import foodImg from './assets/food.jpg';
import { Typography } from '@mui/material';
import './ZomatoPro.css';
import './AppHeader.css';

function App() {
  const [user, setUser] = useState(null);

  function logout() {
    setUser(null);
  }

  return (
    <div className="main-app">
      <div className="app-header">
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png" alt="Zomato Logo" className="zomato-logo" />
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

export default App;
