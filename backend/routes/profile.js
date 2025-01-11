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


router.put('/:userId', (req, res) => {
  console.log(`Received profile update for userId: ${req.params.userId}`);
  console.log('Request body:', req.body);

  const userId = parseInt(req.params.userId, 10);
  const { name, password, profilePicture } = req.body;

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID.' });
  }

  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (name) users[userIndex].name = name;
  if (password) users[userIndex].password = password; 
  if (profilePicture) users[userIndex].profilePicture = profilePicture;

  saveUsers(users);

  res.status(200).json({ message: 'Profile updated successfully.', user: users[userIndex] });
});

module.exports = router;
