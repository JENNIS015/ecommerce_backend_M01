const express = require('express'),
  router = express.Router(),
 EmailController = require('../controllers/emails.controller');

class RouterEmail {
  constructor() {
    this.controlador = new EmailController();
  }

  start() {
    router.post('/:template', this.controlador.postEmail);
      return router;
  
  }
}

module.exports = RouterEmail;
