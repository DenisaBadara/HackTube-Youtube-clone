const fs = require('fs');
const path = require('path');

const getUsers = () => {
  const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      console.log('Successfully read users.json');
      return JSON.parse(data);
    }
    console.log('users.json does not exist, returning empty array');
    return [];
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader); // Logare

  if (!authHeader) {
    console.log('No authorization header provided');
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  const tokenParts = authHeader.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    console.log('Invalid token format');
    return res.status(401).json({ error: 'Invalid token format' });
  }

  const userId = parseInt(tokenParts[1], 10);
  console.log('Parsed user ID:', userId); // Logare

  if (isNaN(userId)) {
    console.log('Invalid token');
    return res.status(401).json({ error: 'Invalid token' });
  }

  const users = getUsers();
  const user = users.find(u => u.id === userId);
  console.log('Authenticated user:', user); // Logare

  if (!user) {
    console.log('User not found');
    return res.status(401).json({ error: 'User not found' });
  }

  req.user = user;
  next();
};

module.exports = authenticate;
