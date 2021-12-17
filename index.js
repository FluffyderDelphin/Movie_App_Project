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
app.use(bodyParser.urlencoded({ extended: true }));

const passport = require('passport');
require('./passport');
app.use(passport.initialize());
const cors = require('cors');

const { check, validatonResult } = require('express-validator');

// app.use(cors());

let allowedOrigins = ['http://localhost:8080'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          "The CORS policy for this application doesn't allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

require('./auth')(app);

// Get Movie List
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find().then((movies) => res.json(movies));
  }
);

// Get Data About Movie by Title
app.get(
  '/movies/:title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ title: req.params.title })
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);
// Get Data about Genre
app.get(
  '/movies/genres/:genrename',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'genre.name': req.params.genrename })
      .then((movie) => {
        res.status(201).send(movie.genre.description);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);
// Get Director Data
app.get(
  '/movies/directors/:director',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'director.name': req.params.director })
      .then((movie) => {
        res.status(201).json(movie.director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);
// Add User
app.post(
  '/users',
  [
    check(
      'Username',
      'Username is required and needs to have at least 5 Characters'
    ).isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  (req, res) => {
    let errors = validatonResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashedPassword(req.body.password);
    Users.findOne({ username: req.params.username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.username + ' already exists');
        } else {
          Users.create({
            username: req.body.username,
            password: hashedPassword,
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
  }
);
// Read User Data
app.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);
// Read User by Name

app.get(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ username: req.params.username })
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Errror: ' + err);
      });
  }
);
// Change User Info by Name
app.put(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
  }
);
// Adding Movie to Users List of Favorites
app.put(
  '/users/:username/favorites/add/:movieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
  }
);
// Remove Favorite
app.put(
  '/users/:username/favorites/remove/:movieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
  }
);
// Remove User
app.delete(
  '/users/:userId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
  }
);
app.use((err, req, res, next) => {
  console.error(err.stack);
});

app.listen(8080, () => {
  console.log('App ist Running on Port 8080');
});
