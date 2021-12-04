const express = require('express'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  models = require('./models.js');

const Movies = models.Movies;
const users = models.Users;

// bodyParser = require('body-parser'),
// uuid = require('uuid');

mongoose.connect('mongodb://localhost:27017/dbname', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(morgan('common'));
app.use(express.static('public'));
// app.use(bodyParser.json());

// Get Movie List
app.get('/movies', (req, res) => {
  // res.json(movies);
  res.send('GETing the List of Movies was a success !');
});

// Get Data About Movie by Title
app.get('/movies/:title', (req, res) => {
  res.send('GETing the Details about the Title was sucessful');
});
// Get Data about Genre
app.get('/movies/:title/genre', (req, res) => {
  res.send('GETing the Details about the Title Genre was succesful');
});
// Get Director Data
app.get('/movies/:title/director', (req, res) => {
  res.send('GETing the Details about the Title Director was succesful');
});
// Add User
app.post('/users', (req, res) => {
  res.send('User was added succesfully');
});
// Change Username
app.put('/users/:id', (req, res) => {
  res.send('Username was changes succesfully!');
});

// Adding Movie to Users List of Favorites

app.post('/users/:id/favorites', (req, res) => {
  res.send('Title succesfully added to Favorites');
});
// Remove Favorite
app.delete('/users/:id/favorites/:title', (req, res) => {
  res.send('Title succesfully deletet from Favorites');
});
// Remove User
app.delete('/users/:id', (req, res) => {
  res.send('User was succesfully removed fromt the List(by Email)');
});

// app.get('/', (req, res) => {
//   res.send('This is just a Test.');
// });

// app.get('/movies', (req, res) => {
//   res.json(top10movies);
// });

app.use((err, req, res, next) => {
  console.error(err.stack);
});

app.listen(8080, () => {
  console.log('App ist Running on Port 8080');
});
