const express = require('express'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  models = require('./mongoose_models/models.js');
const bodyParser = require('body-parser');
const passport = require('passport');
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
// app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app);
// Get Movie List
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find().then((movies) => res.json(movies));
  }
);

// Get Data About Movie by Title
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// Get Data about Genre
app.get('/movies/genres/:genrename', (req, res) => {
  Movies.findOne({ 'genre.name': req.params.genrename })
    .then((movie) => {
      res.status(201).send(movie.genre.description);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// Get Director Data
app.get('/movies/directors/:director', (req, res) => {
  Movies.findOne({ 'director.name': req.params.director })
    .then((movie) => {
      res.status(201).json(movie.director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// Add User
app.post('/users', (req, res) => {
  Users.findOne({ username: req.params.username })
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
      res.status(500).send('Error: ' + err);
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
app.put('/users/:username/favorites/add/:movieID', (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $push: { favMovies: req.params.movieID },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        // res.json(updatedUser);
        res.send(req.params.movieID + 'was succesfully added to Favorites!');
      }
    }
  );
});
// Remove Favorite
app.put('/users/:username/favorites/remove/:movieID', (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    { $pull: { favMovies: req.params.movieID } },
    { new: true },
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.send(req.params.movieID + 'was removed from Favorites');
      }
    }
  );
});
// Remove User
app.delete('/users/:userId', (req, res) => {
  Users.findOneAndRemove({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        res
          .status(400)
          .send('User with the ID: ' + req.params.userId + ' was not found');
      } else {
        res
          .status(200)
          .send('User with the ID: ' + req.params.userId + ' deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
});

app.listen(8080, () => {
  console.log('App ist Running on Port 8080');
});
