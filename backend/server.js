require('dotenv').config(); 

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;
const USERS_FILE = './data/users.json';

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

const videosRouter = require('./routes/videos');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');

app.use('/auth', authRouter);

app.use('/videos', videosRouter);

app.use('/profile', profileRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Server stopped.');
  process.exit();
});
