const express = require('express');
const ChatController = require('../controllers/chat.controller');
const router = express.Router();
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });

class RouterChat {
  constructor() {
    this.controlador = new ChatController();
  }

  start() {
    router.get('/', requireAuth, new ChatController().getAllChat);
    return router;
  }
}
module.exports = RouterChat;
