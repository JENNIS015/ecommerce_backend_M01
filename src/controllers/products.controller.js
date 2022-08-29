const ProductDTO = require('../classes/Products/ProductsDTO.class'),
  ProductDAOFactory = require('../classes/Products/ProductDAOFactory.class'),
  APICustom = require('../classes/Error/customError');

const { upload } = require('../utils/functions');
class ProductsController {
  constructor() {
    this.ProductsDAO = ProductDAOFactory.get();
    this.message = new APICustom();
  }
  ///////FUNCIONES GENERALES////////
  productsAll = async () => {
    const docs = await this.ProductsDAO.mostrarTodos();
    const productos = docs.map((p) => {
      return new ProductDTO(p);
    });

    return productos;
  };

  categories = async () => {
    const cat = await this.ProductsDAO.mostrarTodasCategorias();
    return cat;
  };

  productId = async (id) => {
    const doc = await this.ProductsDAO.mostrarId(id);
    const productsDto = new ProductDTO(doc);
    return productsDto;
  };

  productCategory = async (id) => {
    try {

      const docs = await this.ProductsDAO.mostrarCategoria(id);
      const productos = docs.map((p) => {
        return new ProductDTO(p);
      });
      return productos;
    } catch (error) {
      this.message.errorNotFound(error, 'categoria no encontrada');
    }
  };

  ///////PRINT JSON////////
  getProducts = async (req, res) => {
    try {
      res.status(200).json({ product: await this.productsAll() });
    } catch (error) {
      this.message.errorNotFound(error, 'productos no encontrado');
    }
  };

  getProductId = async (req, res) => {
    const id = req.params.id;
    try {
      res.status(200).json({ producto: await this.productId(id) });
    } catch (error) {
      this.message.errorNotFound(error, 'producto no encontrado');
    }
  };

  getCategoriaId = async (req, res) => {
    const id = req.params.id;
    try {
      res
        .status(200)
        .json({ producto: await this.ProductsDAO.mostrarCategoria(id) });
    } catch (error) {
      this.message.errorNotFound(error, 'categoria id no encontrado');
    }
  };

  saveProducts = async (req, res) => {
    try {

      const file_names = req.files.map((file) => file.filename);
      await this.ProductsDAO.guardar({ ...req.body, foto: file_names });
      res.status(200).json({ status: true, result: 'Producto Guardado' });
    } catch (error) {
      this.message.errorInternalServer(
        error,
        'No se ha podido guardar el producto'
      );
    }
  };

  deleteProduct = async (req, res) => {
    await this.ProductsDAO.eliminar('id', req.params.id)
      .then(() => {
        res.status(200).send('Status: Producto Eliminado');
      })
      .catch((error) =>
        this.message.errorInternalServer(
          error,
          ' No se ha podido eliminar producto'
        )
      );
  };

  formEditProduct = async (req, res) => {
    const id = req.params.id;

    await this.ProductsDAO.mostrarId(id)
      .then((result) => {
        res.status(200).json({ title: 'Editar', data: result });
      })
      .catch((error) => {
        this.message.errorInternalServer(
          error,
          ' No se ha podido editar producto'
        );
      });
  };

  editProduct = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
      await this.ProductsDAO.actualizar(id, body);
      res.status(200).send('Producto actualizado');
    } catch (error) {
      this.message.errorInternalServer(
        error,
        ' No se ha podido editar producto'
      );
    }
  };
}

module.exports = ProductsController;
