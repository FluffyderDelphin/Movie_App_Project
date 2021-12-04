const express = require('express'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  models = require('./mongoose_models/models.js');

const movies = models.movies;
const users = models.users;

const bodyParser = require('body-parser');
// const uuid = require('uuid');

mongoose.connect('mongodb://localhost:27017/appdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());

// Get Movie List
app.get('/movies', (req, res) => {
  // res.json(movies);
  movies.find().then((movies) => res.json(movies));
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
// Add Use
app.post('/users', (req, res) => {
  users
    .findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + 'already exists');
      } else {
        users
          .create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            birthday: req.body.birthday,
          })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
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
