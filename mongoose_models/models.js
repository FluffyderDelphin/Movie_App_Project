let mongoose = require('mongoose');

let movieShema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  Genre: {
    name: String,
    description: String,
  },
  director: {
    name: String,
    bio: String,
  },
  actors: [String],
  imageurl: String,
  featured: Boolean,
});

let userShema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  favmovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movies' }],
});

let movie = mongoose.model('movie', movieShema);
let users = mongoose.model('user', userShema);

module.exports.movie = movie;
module.exports.users = users;

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
