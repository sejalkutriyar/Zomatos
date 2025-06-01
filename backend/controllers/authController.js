// In-memory users for demo
const users = [
  { username: 'manager', password: 'manager123', role: 'manager' },
  { username: 'rider1', password: 'rider123', role: 'partner', partnerId: 1 },
  { username: 'rider2', password: 'rider123', role: 'partner', partnerId: 2 },
  { username: 'rider3', password: 'rider123', role: 'partner', partnerId: 3 },
];

exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  res.json({ 
    username: user.username, 
    role: user.role, 
    partnerId: user.partnerId 
  });
}; 