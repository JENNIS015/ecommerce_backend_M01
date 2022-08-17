const UserController = require('../controllers/user.controller'),
  UserFactory = require('../classes/User/UserFactory.class'),
  sendEmail = require('../notificaciones/emails/Registration/newUser'),
  userController = new UserController(),
  passport = require('passport'),
  passportLocal = require('passport-local'),
  { Strategy } = require('passport-facebook'),
  GoogleStrategy = require('passport-google-oauth2').Strategy,
  LocalStrategy = passportLocal.Strategy,
  JWTStrategy = require('passport-jwt'),
  FacebookStrategy = Strategy,
  config = require('../utils/config.js'),
  logger = require('../utils/loggers');

authUser = async (request, accessToken, refreshToken, profile, cb) => {
  const exist = await UserFactory.get().mostrarEmail(profile.emails[0].value);
  if (exist) {
    cb(null, profile);
  } else {
    const newUserRegister = {
      email: profile.emails[0].value,
      name: profile.name.givenName,
      lastName: profile.name.familyName,
      membershipID: 2,
      avatar: profile.photos[0].value,
      ref: 'Red',
    };

    await UserFactory.get().guardar(newUserRegister);
    cb(null, newUserRegister, sendEmail(newUserRegister));
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE.GOOGLE_ID,
      clientSecret: config.GOOGLE.GOOGLE_SECRET,
      callbackURL: '/auth/google/callback',
      passReqToCallback: true,
    },
    authUser
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: config.FACEBOOK.FACE_APP_ID,
      clientSecret: config.FACEBOOK.FACE_APP_SECRET,
      callbackURL: '/auth/facebook/callback',
      profileFields: [
        'id',
        'emails',
        'link',
        'name',
        'updated_time',
        'verified',
        'displayName',
        'photos',
      ],
    },
    authUser
  )
);

passport.use(
  'local-signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    userController.register
  )
);
passport.use(
  'local-signin',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    userController.login
  )
);
passport.use(
  new JWTStrategy.Strategy(
    {
      jwtFromRequest: (req) => {
        let token = null;

        if (req && req.cookies) {
          token = req.cookies.jwt;
        }
        return token;
      },
      secretOrKey: config.JWT.SECRET,
    },
    (jwtPayload, done) => {
      if (!jwtPayload) {
        logger.error('error in jtw');
        return done('No token found...');
      }

      return done(null, jwtPayload);
    }
  )
);
passport.serializeUser(function (user, done) {
  try {
    done(null, {
      name: user.givenName ? user.givenName : user.name,
      email: user.email ? user.email : user.emails[0].value,
      membership: user.membershipID ? user.membershipID : 2,
    });
  
 
   
  } catch (error) {
    logger.error('error in deserializeUser', error);
    done(error);
  }
 
});

passport.deserializeUser(async (user, done) => {
  try {
    logger.info("****SESSIONES*******")
    const userDetail = await userController.existPassport(
      user.email ? user.email : user._json.email
    );
    done(null, userDetail);
  } catch (error) {
    logger.error('error in deserializeUser', error);
    done(error);
  }
});
