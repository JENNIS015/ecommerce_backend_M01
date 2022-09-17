const APICustom = require('../classes/Error/customError');
const logger = require('../utils/loggers');

const UserController = require('../controllers/user.controller'),
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
        expiresIn: '1d',
      });
      return token;
    };

    router.post(
      '/signup',

      passport.authenticate('local-signup', {
        failureFlash: true,
      }),
      (req, res) => {
        const token = generateJwtToken(req.user);
        res.cookie('jwt', token);
        return token;
      }
    );

    router.post( 
      '/signin',    function(req,res,next){
      passport.authenticate('local-signin', {
        failureFlash: true,
         })(req,res,next); 
})
      
         
   

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

    router.get('/', ensureAuthenticated, (req, res) => {
      res.render('index', { user: req.user });
    });

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
