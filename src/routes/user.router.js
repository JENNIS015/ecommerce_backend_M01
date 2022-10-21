const APICustom = require('../classes/Error/customError'),
  UserController = require('../controllers/user.controller'),
  router = require('express').Router(),
  config = require('../utils/config.js'),
  jwt = require('jsonwebtoken');

class RouterUser {
  constructor() {
    this.controlador = new UserController();
    this.message = new APICustom();
  }

  start() {
    require('../auth/local-auth');
    const ensureAuthenticated = (req, res, next) => {
      if (ensureAuthenticated) {
        return next();
      } else {
        res.redirect('/');
      }
    };

    router.post('/signup', this.controlador.register, (req, res) => {
      try {
        // create token
        const token = jwt.sign(
          {
            name: req.user.email,
            membershipID: req.user.membershipID,
          },
          config.JWT.SECRET
        );

        // Set jwt token in cookie as 'access_token'
        res.cookie('access_token', token, {
          maxAge: 3600, // expires after 1 hr
          httpOnly: true, // cannot be modified using XSS or JS
        });
        res.json({ message: 'Success', token: token });
      } catch (err) {
        res.json({ message: 'Error', err: err });
      }
    });

    router.post('/signin', this.controlador.login)

    router.get(
      '/profile/:id',
      ensureAuthenticated,
      this.controlador.renderProfile
    );

    router.post('/forgot', this.controlador.forgot);
    router.get('/reset/:token', this.controlador.checkToken);
    router.post('/reset/:token', this.controlador.updatePassword);

    router.get('/logout', this.controlador.renderLogOut);
    router.put(
      '/profile/:id',
      ensureAuthenticated,
      this.controlador.editProfile
    );
    router.delete(
      '/user/:id',
      ensureAuthenticated,
      this.controlador.deleteUser
    );
    router.get('/users', this.controlador.getUsers);
    return router;
  }
}
module.exports = RouterUser;
