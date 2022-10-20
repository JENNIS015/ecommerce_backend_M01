const logger = require('../../src/utils/loggers');
const config = require('../utils/config');

function isAdmin(req, res, next) {
 
  logger.info('token', req.cookies);
 logger.info('token', req.signedCookies);
const token = req.cookies;
  if (!token) return res.status(401).json({ error: 'Acceso denegado' });

  try {
    const verified = jwt.verify(token, config.JWT.SECRET);
    req.user = verified;
    logger.info('   req.user ', req.user);
    if (req.user.membershipID === 1) {
      next();
    } else {
      res.status(400).json({ error: 'token no es admin' });
    }
  } catch (error) {
    res.status(400).json({ error: 'token no es válido' });
  }
}

module.exports = { isAdmin };
