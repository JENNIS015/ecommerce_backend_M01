const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/products.controller');
const { isAdmin } = require('../passport/support');
class RouterProduct {
  constructor() {
    this.controlador = new ProductsController();
  }

  start() {
    router.get('/', this.controlador.getProducts);
    router.post('/', isAdmin, this.controlador.saveProducts);
    router.delete('/:id', isAdmin, this.controlador.deleteProduct);
    router.get('/:id', this.controlador.getProductId);

    router.get('/categoria/:id', this.controlador.getCategoriaId);
    router.get('/edit/:id', isAdmin, this.controlador.formEditProduct);
    router.put('/:id', isAdmin, this.controlador.editProduct);

    return router;
  }
}
module.exports = RouterProduct;
