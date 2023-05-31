import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getUsername, getPassword, createUser } from './database.js';
import express from 'express';
import ejs from 'ejs';
import http from 'http';
import { Server } from 'socket.io';
import { exec } from 'child_process';
import path from 'path';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const userProfilesDirectory = path.join(
  __dirname,
  'views',
  'soul_painter',
  'user_profile'
);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Set EJS as the view engine

// Configure express-session middleware
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Route to Login Page
app.get('/login', (req, res) => {
  res.render('login', { error: null }); // Render the login.ejs view with no error
});

// Handle login form submission
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const fetchedUsername = await getUsername(username);
  const fetchedPassword = await getPassword(username);

  if (fetchedUsername && fetchedPassword === password) {
    // Store the username in the session
    req.session.username = username;
    // console.log("before",req.sessionID);
    res.cookie('username', username, { maxAge: 3600000 });
    res.redirect('http://localhost:3333');
    // console.log(`after: ${req.sessionID}`)

    // Execute game.js using the "node" command
    exec('node game.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing game.js: ${error}`);
        return;
      }
      console.log(`game.js executed successfully.`);
    });
  } else {
    res.render('login', { error: 'Invalid username or password.' });
  }
});

// Route to Register Page
app.get('/register', (req, res) => {
  res.render('register', { success: false, error: null }); // Render the register.ejs view
});

// Handle registration form submission
app.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.render('register', { success: false, error: 'password_mismatch' }); // Render the register.ejs view with the password mismatch error
    return;
  }

  const existingUser = await getUsername(username);
  if (existingUser) {
    res.render('register', { success: false, error: 'username_exists' }); // Render the register.ejs view with the username exists error
    return;
  }

  await createUser(username, password);
  res.render('register', { success: true, error: null }); // Render the register.ejs view with the success message
});

server.listen(5000, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Server is running on http://localhost:${port}`);
});

server.on('error', (error) => {
  console.error('Server failed to start:', error);
});
