const logger = require('../utils/loggers');
const config = require('../utils/config'),
  jwt = require('jsonwebtoken')

function isAdmin(req, res, next) {

  let bearerToken = null;
  // check if bearer header exists via API request
  let bearerHeader = req.headers['authorization'];
  logger.info('bearerHeader', bearerHeader);

  if (typeof bearerHeader !== 'undefined') {
    // authorization: bearer token12345
    bearerToken = bearerHeader.split(' ')[1];
  }

  // get cookieToken
  let cookieToken = req.cookies ? req.cookies.access_token : null;

  // set token from bearer header token or cookieToken
  let token = bearerToken || cookieToken;

  jwt.verify(token, config.JWT.SECRET, (err, data) => {
    if (err) {
      return res.sendStatus(403); // forbidden
    }
    req.token = token;
    req.auth = data;
  
    if (data.membershipID === 1) {
      next();
    } else {
      res.sendStatus(403);
    }
  });

  // const token = req.cookies;
  //   if (!token) return res.status(401).json({ error: 'Acceso denegado' });

  //   try {
  //     const verified = jwt.verify(token, config.JWT.SECRET);
  //     req.user = verified;
  //     logger.info('   req.user ', req.user);
  //     if (req.user.membershipID === 1) {
  //       next();
  //     } else {
  //       res.status(400).json({ error: 'token no es admin' });
  //     }
  //   } catch (error) {
  //     res.status(400).json({ error: 'token no es válido' });
  //   }
}

module.exports = { isAdmin };
