import { useState } from 'react';
import { Button, TextField, Card, CardContent, Typography, Alert } from '@mui/material';
import { login } from '../../services/api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await login(username, password);
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
          <TextField 
            label="Username" 
            fullWidth 
            margin="normal" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
          />
          <TextField 
            label="Password" 
            type="password" 
            fullWidth 
            margin="normal" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
          <Button 
            variant="contained" 
            color="primary" 
            type="submit" 
            fullWidth 
            sx={{ mt: 2 }}
          >
            Login
          </Button>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          <b>Manager:</b> manager / manager123<br/>
          <b>Rider:</b> rider1 / rider123, rider2 / rider123, rider3 / rider123
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Login; 