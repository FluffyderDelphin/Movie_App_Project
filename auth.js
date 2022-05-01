const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport');

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256',
  });
};

/**
 * @swagger
 * /login/:
 *  post:
 *    summary: Logs in a user
 *    parameters:
 *      - in: body
 *        description: object containing username and password to login
 *        example:
 *          username: "Hamza123"
 *          password: "123123123"
 *    responses:
 *       '400':
 *          description: login failed
 *       '200':
 *          description: an object containing the token and the user object that has just logged in
 *          examples:
 *            application/json:
 *                user:
 *                  _id: "asdas08d12083180qs89das"
 *                  username: "Hamza123"
 *                  email: "asd@asd.com"
 *                  birthday: "10-10-2000"
 *                  favMovies: []
 *                token: "sdiouoiu0812ue8912ueqw98cdu98qsud9812ud98qsdu9128du"
 */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Somthing not right',
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        delete user.password;
        return res.json({ user, token });
      });
    })(req, res);
  });
};
