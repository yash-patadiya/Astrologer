const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load Contact model
const Contact = require('./models/contact');
require('dotenv').config();
// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(process.env.MONGO_CONNECTION)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// View engine setup
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  // ensure the template always has `errors` and `form` available
  res.render('contact', { errors: [], form: {} });
});
app.get('/fte', (req, res) => {
  // ensure the template always has `errors` and `form` available
  res.render('footer1', { errors: [], form: {} });
});

const Joi = require('joi');

const contactValidationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address'
  }),
  phone: Joi.string().pattern(/^[0-9]{10}$/).allow('', null).messages({
    'string.pattern.base': 'Phone number must be exactly 10 digits'
  }),
  subject: Joi.string().max(200).allow('', null),
  message: Joi.string().min(5).required().messages({
    'string.empty': 'Message is required',
    'string.min': 'Message must be at least 5 characters'
  })
});

app.post('/contact', async (req, res) => {
  const { error, value } = contactValidationSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const errors = error.details.map(d => d.message);
    // Render contact page with validation errors and prefilled form
    return res.status(400).render('contact', { errors, form: req.body });
  }

  const { name, email, phone, subject, message } = value;
  try {
    const contact = new Contact({ name, email, phone, subject, message });
    await contact.save();
    console.log('Saved contact:', contact);
    return res.redirect('/?saved=1');
  } catch (err) {
    console.error('Error saving contact:', err);
    return res.status(500).render('contact', { errors: ['Unable to save contact at this time'], form: req.body });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(process.env.PORT || 3000);

