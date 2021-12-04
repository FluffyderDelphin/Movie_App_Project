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
