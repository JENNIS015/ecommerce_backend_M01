const express = require('express');
const router = express.Router();
const RequestViews = require('../controllers/view.controller');
 
class RouterViews {
  constructor() {
    this.view = new RequestViews();
  }

  start() {
    router.get('/', this.view.indexPage);
    router.get('/categorias', this.view.obtenerCategorias);
    router.get('/precios', this.view.obtenerPrecios);
    router.get('/colores', this.view.obtenerColores);
   

    return router;
  }
}
module.exports = RouterViews;
