function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.membershipID === 1) {
    return next();
  }
     res.status(403).json({
      error: 'se requiere autenticacion  de admin para acceder a este recurso'
    });
 
}


module.exports = { isAdmin};
