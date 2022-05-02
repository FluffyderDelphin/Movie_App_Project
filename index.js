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

// mongoose.connect(process.env.CONNECTION_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const app = express();
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const passport = require('passport');
require('./passport');
app.use(passport.initialize());
const cors = require('cors');

const { check, validationResult } = require('express-validator');

app.use(cors());

// let allowedOrigins = ['http://localhost:8080'];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         let message =
//           "The CORS policy for this application doesn't allow access from origin " +
//           origin;
//         return callback(new Error(message), false);
//       }
//       return callback(null, true);
//     },
//   })
// );

require('./auth')(app);

// Get Movie List
// app.get(
//   '/movies',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     Movies.find().then((movies) => res.json(movies));
//   }
// );

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Movie App',
      description: 'Movie App Information',
      contact: {
        name: 'Alexander Ulrich ',
      },
      servers: ['http://localhost:8080'],
    },
  },
  apis: ['index.js', 'auth.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /movies:
 *  get:
 *    summary: get List of Movies
 *    responses:
 *       '500':
 *          description: Error getting movies
 *       '200':
 *          description: Array of Movies is returned
 *          examples:
 *            application/json:
 *              _id: "asdas08d12083180qs89das"
 *              title: "Hunt for the Wilderpeople"
 *              imgeurl: "https://picsum.photos/230/300?random=3"
 *              description: "this movie is...."
 *              genre: {
 *                    name:"genre",
 *                    description:"this genre is..."
 *               }
 *              director: {
 *                     name:"directorname"
 *                      bio:"this guy"
 *                      birth:"1975-08-16"
 *              }
 */
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find()
      .then(function (movies) {
        res.status(201).json(movies);
      })
      .catch(function (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

/**
 * @swagger
 * /movies/:title:
 *  get:
 *    summary: get Movie by Title
 *    parameters:
 *      - in: path
 *        name: title
 *        required: true
 *        description: title of the targeted movie
 *      - in: header
 *        name: Authorization
 *        description: Bearer JWT token
 *    responses:
 *       '500':
 *          description: Error getting movie
 *       '200':
 *          description: Movie Object is returned
 *          examples:
 *            application/json:
 *              _id: "asdas08d12083180qs89das"
 *              title: "Hunt for the Wilderpeople"
 *              imgeurl: "https://picsum.photos/230/300?random=3"
 *              description: "this movie is...."
 *              genre: {
 *                    name:"genre",
 *                    description:"this genre is..."
 *               }
 *              director: {
 *                     name:"directorname"
 *                      bio:"this guy"
 *                      birth:"1975-08-16"
 *              }
 *
 *
 */

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

/**
 * @swagger
 * /movies/genres/:genrename:
 *  get:
 *    summary: get genre by Genre Name
 *    parameters:
 *      - in: path
 *        name: genrename
 *        required: true
 *        description: genrename of targeted genre
 *      - in: header
 *        name: Authorization
 *        description: Bearer JWT token
 *    responses:
 *       '500':
 *          description: Error getting genre
 *       '200':
 *          description: Genre Object returned
 *          examples:
 *            application/json:
 *              genre: {
 *                    name:"genre",
 *                    description:"this genre is..."
 *               }
 *
 *
 */

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

/**
 * @swagger
 * /movies/directors/:director:
 *  get:
 *    summary: get Director by directorname
 *    parameters:
 *      - in: path
 *        name: director
 *        required: true
 *        description: directornameof targeted director
 *      - in: header
 *        name: Authorization
 *        description: Bearer JWT token
 *    responses:
 *       '500':
 *          description: Error getting Director
 *       '200':
 *          description: Director Object Returned
 *          examples:
 *            application/json:
 *              director: {
 *                     name:"directorname"
 *                      bio:"this guy"
 *                      birth:"1975-08-16"
 *              }
 *
 *
 */

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

/**
 * @swagger
 * /users:
 *  post:
 *    summary: Post new User Object
 *    responses:
 *       '500':
 *          description: user update failed
 *       '200':
 *          description: Posted user object
 *          examples:
 *            application/json:
 *              _id: "asdas08d12083180qs89das"
 *              username: "Test123"
 *              email: "asd@asd.com"
 *              birthday: "10-10-2000"
 *              favMovies: []
 */

// Add User
app.post(
  '/users',
  [
    check(
      'username',
      'Username is required and needs to have at least 5 Characters'
    ).isLength({ min: 5 }),
    check(
      'username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail(),
  ],
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.password);
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

/**
 * @swagger
 * /users:
 *  get:
 *    summary: get list of Users
 *    responses:
 *       '500':
 *          description: Error getting movie
 *       '403':
 *          description: no valid bearer token provided
 *       '200':
 *          description: Movie Object is returned
 *          examples:
 *            application/json:
 *              _id: "asdas08d12083180qs89das"
 *              username: "Hamza123"
 *              email: "asd@asd.com"
 *              birthday: "10-10-2000"
 *              favMovies: []
 *
 *
 */

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

/**
 * @swagger
 * /users/:username:
 *  get:
 *    summary: data of one User
 *    parameters:
 *      - in: path
 *        name: username
 *        required: true
 *        description: title of the targeted movie
 *      - in: header
 *        name: Authorization
 *        description: Bearer JWT token
 *    responses:
 *       '500':
 *          description: Error getting user
 *       '403':
 *          description: no valid bearer token provided
 *       '200':
 *          description: User Object is returned
 *          examples:
 *            application/json:
 *              _id: "asdas08d12083180qs89das"
 *              username: "Test123"
 *              email: "asd@asd.com"
 *              birthday: "10-10-2000"
 *              favMovies: []
 *
 */

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

/**
 * @swagger
 * /users/:username:
 *  put:
 *    summary: Update user details by username
 *    parameters:
 *      - in: path
 *        name: username
 *        required: true
 *        description: username of the targeted user object
 *      - in: header
 *        name: Authorization
 *        description: Bearer JWT token
 *      - in: body
 *        description: user object, new data for update
 *        example:
 *          username: "Hamza123"
 *          password: "123123123"
 *          email: "asd@asd.com"
 *          birthday: "10-10-2000"
 *    responses:
 *       '500':
 *          description: user update failed
 *       '403':
 *          description: no valid bearer token provided
 *       '200':
 *          description: The updated user object
 *          examples:
 *            application/json:
 *              _id: "asdas08d12083180qs89das"
 *              username: "Test123"
 *              email: "asd@asd.com"
 *              birthday: "10-10-2000"
 *              favMovies: []
 */

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
          password: Users.hashPassword(req.body.password),
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
          delete updatedUser.password;
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * @swagger
 * /users/:username:/favorites/add/:movieID:
 *  put:
 *    summary: Add Movie from Users List of Favorites
 *    parameters:
 *      - in: path
 *        name: username,movieId
 *        required: true
 *        description: username of the targeted user object and MovieID of Movie to add
 *      - in: header
 *        name: Authorization
 *        description: Bearer JWT token
 *    responses:
 *       '500':
 *          description: adding to Favorites has failed
 *       '403':
 *          description: no valid bearer token provided
 *       '200':
 *          description: The updated user object
 *          examples:
 *            application/json:
 *              _id: "asdas08d12083180qs89das"
 *              username: "Test23"
 *              email: "asd@asd.com"
 *              birthday: "10-10-2000"
 *              favMovies: [
 *                  _id:"SSAFWW671300763"
 *              ]
 */

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
          delete updatedUser.password;
          res.json(updatedUser);
          // res.send(req.params.movieID + 'was succesfully added to Favorites!');
        }
      }
    );
  }
);

/**
 * @swagger
 * /users/:username:/favorites/add/:movieID:
 *  put:
 *    summary: Removes Movie from Users List of Favorites
 *    parameters:
 *      - in: path
 *        name: username,movieId
 *        required: true
 *        description: username of the targeted user object and MovieID of Movie to remove
 *      - in: header
 *        name: Authorization
 *        description: Bearer JWT token
 *    responses:
 *       '500':
 *          description: removing from Favorites has failed
 *       '403':
 *          description: no valid bearer token provided
 *       '200':
 *          description: The updated user object
 *          examples:
 *            application/json:
 *              _id: "asdas08d12083180qs89das"
 *              username: "Hamza123"
 *              email: "asd@asd.com"
 *              birthday: "10-10-2000"
 *              favMovies: []
 */

// Remove Favorite
app.put(
  '/users/:username/favorites/remove/:movieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { username: req.params.username },
      { $pull: { favMovies: req.params.movieID } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
          // res.send(req.params.movieID + 'was removed from Favorites');
        }
      }
    );
  }
);

/**
 * @swagger
 * /users/:userId:
 *  delete:
 *    summary: Add Movie from Users List of Favorites
 *    parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        description: userdID of the User to be deleted
 *      - in: header
 *        name: Authorization
 *        description: Bearer JWT token
 *    responses:
 *       '500':
 *          description: removing the User has failed
 *       '403':
 *          description: no valid bearer token provided
 *       '200':
 *          description: 'User with the ID [userID] deleted'
 */

// Remove User
app.delete(
  '/users/:userId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ _id: req.params.userId })
      .then((user) => {
        if (!user) {
          res.status(400).json({
            message: `user with the the id ${user._id} was not deleted`,
          });
        } else {
          res.status(200).json({
            message: `user with the the id ${user._id} has been deleted`,
          });
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

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`App ist Running on Port ${port}`);
});
