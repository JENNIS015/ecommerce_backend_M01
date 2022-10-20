const logger = require('../../src/utils/loggers')

  function isAdmin(req, res, next) {
    logger.info('Identificado', req.isAuthenticated());
    logger.info('Membresia', req._passport.session.user);
    if (req.isAuthenticated() && req._passport.session.user.membershipID === 1) {
      return next();
    } else {
      res.status(403).json({
        error:
          'se requiere autenticacion  de admin para acceder a este recurso',
      });
    }
  };

module.exports = { isAdmin };
