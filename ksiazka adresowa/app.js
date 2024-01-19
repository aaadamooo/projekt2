const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const Person = require('./models/personRecord');
const bookRoutes = require('./routes/bookRoutes');
const { auth } = require('express-openid-connect');

// express app
const app = express();

// connect to mongodb and listen for requests
const dbURI = "mongodb+srv://admin1:admin@cluster0.qzekyya.mongodb.net/myDb?retryWrites=true&w=majority";
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Configure session
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// Auth0 configuration
const authConfig = {
  authRequired: true,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'IyGzi5KZ3o5K5MJpKCTHo5hGjr22mZ0q',
  issuerBaseURL: 'https://dev-d6y31cgmoclv41jo.us.auth0.com',
};

// Auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(authConfig));

// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.oidc.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login'); // Redirect to your login route
  }
};

// Apply isLoggedIn middleware to protect routes
app.use(isLoggedIn);

// Routes
app.use(bookRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
