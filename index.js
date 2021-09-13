const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const connectDB = require('./utils/mongodb');

// Connect to database
connectDB();

const app = express();

// Body parser
// app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.json());

// Enable cors
if (process.env.NODE_ENV === 'Development') {
  app.use(
    cors()
  );
  app.use(morgan('dev'));
}

// Routes
app.use(require('./routes/auth'));
app.use(require('./routes/bloodbank'));
app.use(require('./routes/camp'));
app.use(require('./routes/user'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

