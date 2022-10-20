const logger = require('../../src/utils/loggers')

  function isAdmin(req, res, next) {
    logger.info('Identificado', req.isAuthenticated());
    logger.info('Membresia', req._passport);
        logger.info('Membresia', req);
    if (req.isAuthenticated() && req.user.membershipID === 1) {
      return next();
    } else {
      res.status(403).json({
        error:
          'se requiere autenticacion  de admin para acceder a este recurso',
      });
    }
  };

module.exports = { isAdmin };
