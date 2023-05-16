import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getUsername, getPassword, createUser } from './database.js';
import express from 'express';
import ejs from 'ejs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Set EJS as the view engine

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
    res.send(`Welcome, ${fetchedUsername}!`); // Replace with the appropriate response
  } else {
    res.render('login', { error: 'Invalid username or password.' }); // Render the login.ejs view with the error message
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

const server = app.listen(8081, () => {
  const host = server.address().address;
  const port = server.address().port;
});
