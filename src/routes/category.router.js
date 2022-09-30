const express = require('express');
const CategoryController = require('../controllers/category.controller');
const router = express.Router();
const { isAdmin } = require('../passport/support');

class RouterCategory {
  constructor() {
    this.controlador = new CategoryController();
  }

  start() {
    router.post('/', isAdmin, this.controlador.newCategoria);
    router.get('/', this.controlador.getCategorias);
    router.delete('/:id', isAdmin, this.controlador.deleteById);

    return router;
  }
}
module.exports = RouterCategory;
