const APICustom = require('../classes/Error/customError'),
  UserController = require('../controllers/user.controller'),
  router = require('express').Router(),
  passport = require('passport'),
  config = require('../utils/config.js'),
  jwt = require('jsonwebtoken');

class RouterUser {
  constructor() {
    this.controlador = new UserController();
    this.message = new APICustom();
  }

  start() {
    require('../passport/local-auth');
    const ensureAuthenticated = (req, res, next) => {
      if (ensureAuthenticated) {
        return next();
      } else {
        res.redirect('/');
      }
    };

    const generateJwtToken = (user) => {
      const token = jwt.sign(user, config.JWT.SECRET, {
        expiresIn: '7d',
      });
      return token;
    };

    router.post(
      '/signup',
      passport.authenticate('local-signup', {
        failureFlash: true,
      }),
      (req, res) => {
         try {
           const token = generateJwtToken(req.user);
           res.cookie('jwt', token, { httpOnly: false });

           res.json({ message: 'Success', token: token });
         } catch (err) {
           res.json({ message: 'Error', err: err });
         }
       

     
      }
    );

    router.post(
      '/signin',
      passport.authenticate('local-signin', {
        failureFlash: false,
      }),
      function (req, res) {
        try {
          const token = generateJwtToken(req.user.toJSON());
          res.cookie('jwt', token, { httpOnly: false });

          res.json({ message: 'Success', token: token });
        } catch (err) {
          res.json({ message: 'Error', err: err });
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
        res.cookie('jwt', token, { httpOnly: true });

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
        res.cookie('jwt', token, { httpOnly: true });

        res.redirect('/productos');
      }
    );

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
