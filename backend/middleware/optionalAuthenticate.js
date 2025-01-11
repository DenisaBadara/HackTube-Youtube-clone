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

const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);

  if (!authHeader) {
    console.log('No authorization header provided, proceeding without user');
    req.user = null;
    return next();
  }

  const tokenParts = authHeader.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    console.log('Invalid token format');
    req.user = null;
    return next();
  }

  const userId = parseInt(tokenParts[1], 10);
  console.log('Parsed user ID:', userId);

  if (isNaN(userId)) {
    console.log('Invalid token');
    req.user = null;
    return next();
  }

  const users = getUsers();
  const user = users.find(u => u.id === userId);
  console.log('Authenticated user:', user);

  if (!user) {
    console.log('User not found');
    req.user = null;
    return next();
  }

  req.user = user;
  next();
};

module.exports = optionalAuthenticate;
