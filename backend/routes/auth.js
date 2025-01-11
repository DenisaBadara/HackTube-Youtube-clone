const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

const getUsers = () => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};


const saveUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users file:', error);
  }
};


router.post('/register', (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ error: 'Name and password are required.' });
  }
  const users = getUsers();
  if (users.find(user => user.name === name)) {
    return res.status(400).json({ error: 'User already exists.' });
  }

  const defaultProfilePicture = 'https://example.com/default-profile-picture.png';

  const newUser = {
    id: users.length + 1,
    name,
    password, 
    profilePicture: defaultProfilePicture,
  };
  users.push(newUser);
  saveUsers(users);
  res.status(201).json({ message: 'User registered successfully.', user: newUser });
});

router.post('/login', (req, res) => {
    console.log('Login attempt:', req.body); 
    const { name, password } = req.body;
    const users = getUsers();
    const user = users.find(user => user.name === name && user.password === password);
    if (!user) {
      console.log('Invalid credentials for user:', name); 
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    console.log('User authenticated:', user); 
    res.status(200).json({ message: 'Login successful.', user });
  });
  

module.exports = router;
