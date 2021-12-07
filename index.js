const express = require('express'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  models = require('./mongoose_models/models.js');
const bodyParser = require('body-parser');
// const uuid = require('uuid');

// Declaring Exportet Mongoose Models
const Movies = models.Movies;
const Users = models.Users;

// Connecting to MongoDB Database
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
  Movies.find().then((movies) => res.json(movies));
});

// Get Data About Movie by Title
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ title: req.body.title })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// Get Data about Genre
app.get('/movies/:genrename', (req, res) => {
  Movies.findOne({ 'genre.name': req.body.genrename })
    .then((genre) => {
      res.status(201).json(genre.description);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// Get Director Data
app.get('/movies/:title/director', (req, res) => {
  res.send('GETing the Details about the Title Director was succesful');
});
// Add User
app.post('/users', (req, res) => {
  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + ' already exists');
      } else {
        Users.create({
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
// Read User Data
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Errror: ' + err);
    });
});
// Read User by Name

app.get('/users/:username', (req, res) => {
  Users.findOne({ username: req.params.username })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Errror: ' + err);
    });
});
// Change Username
app.put('/users/:id', (req, res) => {
  res.send('Username was changes succesfully!');
});
// Change User Info by Name
app.put('/users/:username', (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        birthday: req.body.birthday,
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});
// Adding Movie to Users List of Favorites
app.post('/users/:username/movies/:movieID', (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    { $push: { favoriteMovies: req.params.movieID } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});
app.post('/users/:id/favorites', (req, res) => {
  res.send('Title succesfully added to Favorites');
});
// Remove Favorite
app.delete('/users/:id/favorites/:title', (req, res) => {
  res.send('Title succesfully deletet from Favorites');
});
// Remove User
app.delete('/user/:username', (req, res) => {
  Users.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
app.delete('/users/:id', (req, res) => {
  res.send('User was succesfully removed fromt the List(by Email)');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
});

app.listen(8080, () => {
  console.log('App ist Running on Port 8080');
});
