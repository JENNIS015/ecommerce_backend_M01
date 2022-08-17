const logger = require('../utils/loggers');

const { middleware } = require('../utils/functions'),
  UserController = require('../controllers/user.controller'),
  router = require('express').Router(),
  passport = require('passport'),
  config = require('../utils/config.js'),
  jwt = require('jsonwebtoken'),
  requireAuth = passport.authenticate('jwt', { session: false });

class RouterUser {
  constructor() {
    this.controlador = new UserController();
  }

  start() {
    require('../passport/local-auth');
    const generateJwtToken = (user) => {
      const token = jwt.sign(user, config.JWT.SECRET, {
        expiresIn: '1d',
      });
      return token;
    };

    router.post(
      '/signup',
      middleware,
      passport.authenticate('local-signup', {
        failureFlash: true,
      }),
      (req, res) => {
        const token = generateJwtToken(req.user);
        res.cookie('jwt', token);
        res.redirect('/productos');
      }
    );

    router.post(
      '/signin',
      passport.authenticate('local-signin', {
        failureFlash: true,
      }),
      (req, res) => {
        try {
          const token = generateJwtToken(req.user.toJSON());
          res.cookie('jwt', token);
          res.redirect('/productos');
        } catch (err) {
          logger.error('ERROR', err);
        }
      }
    );

    router.get(
      '/auth/facebook',
      passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
    );

    router.get(
      '/auth/facebook/callback',
      passport.authenticate('facebook', {
        failureMessage: true,
      }),
      function (req, res) {
        const token = generateJwtToken(req.user);
        res.cookie('jwt', token);
        res.redirect('/productos');
      }
    );

    router.get(
      '/auth/google',
      passport.authenticate('google', { scope: ['email', 'profile'] })
    );

    router.get(
      '/auth/google/callback',
      passport.authenticate('google', {
        failureMessage: true,
      }),
      function (req, res) {
        const token = generateJwtToken(req.user);
        res.cookie('jwt', token);
        res.redirect('/productos');
      }
    );

    router.get('/', requireAuth, (req, res) => {
      res.render('index', { user: req.user });
    });

    router.get('/profile', requireAuth, this.controlador.renderProfile);
    router.get('/logout', this.controlador.renderLogOut);
    router.put('/profile/:id', requireAuth, this.controlador.editProfile);


    return router;
  }
}
module.exports = RouterUser;
