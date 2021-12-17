let mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieShema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: {
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
  },
  { collection: 'movies' }
);

let userShema = mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    birthday: Date,
    favMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movies' }],
  },
  { collection: 'users' }
);
userShema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userShema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

let Movies = mongoose.model('Movies', movieShema);
let Users = mongoose.model('User', userShema);

module.exports.Movies = Movies;
module.exports.Users = Users;
