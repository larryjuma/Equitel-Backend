const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();


// Connect mongoose
const connectDB = require('./config/db');
connectDB();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, '../frontend/public')));

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Homepage
app.get('/', (req, res) => {
  res.render('homepage'); // ensure frontend/views/homepage.ejs exists
});

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

const dashboardRoutes = require('./routes/dashboard');
app.use('/', dashboardRoutes); // this will mount /dashboard/:id route

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
