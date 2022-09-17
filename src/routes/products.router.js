const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/products.controller');
const { isAdmin } = require('../passport/support');
const { upload, fileSizeLimitErrorHandler } = require('../utils/functions');
class RouterProduct {
  constructor() {
    this.controlador = new ProductsController();
  }

  start() {
    router.get('/', this.controlador.getProducts);
    router.post(
      '/',
      upload.any(),
      fileSizeLimitErrorHandler,
      this.controlador.saveProducts
    );
    router.delete('/:id', this.controlador.deleteProduct);
    router.put('/imagen/:id', this.controlador.editProductImagen);
    router.get('/:id', this.controlador.getProductId);
    router.get('/categoria/:id', this.controlador.getCategoriaId);
    router.get('/edit/:id', isAdmin, this.controlador.formEditProduct);
    router.put(
      '/:id',
      upload.any(),
      fileSizeLimitErrorHandler,
      this.controlador.editProduct
    );
       router.put('/stock', this.controlador.discountStock);

    return router;
  }
}
module.exports = RouterProduct;
