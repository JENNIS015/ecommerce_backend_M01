const ProductDTO = require('../classes/Products/ProductsDTO.class'),
  ProductDAOFactory = require('../classes/Products/ProductDAOFactory.class'),
  APICustom = require('../classes/Error/customError');

const cloudinary = require('cloudinary');
const { registerDecorator } = require('handlebars');
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
    const item = await this.ProductsDAO.mostrarByItem('categoria');
    return item;
  };
  price = async () => {
    const item = await this.ProductsDAO.mostrarByItem('precio');
    return item;
  };
  color = async () => {
    const item = await this.ProductsDAO.mostrarByItem('color');
    return item;
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
  getProductsFeatured = async (req, res) => {
    await this.ProductsDAO.buscarCondicionBody({ destacado: true })
      .then((result) => res.status(200).json(result))

      .catch((error) => {
        this.message.errorNotFound(error, 'categoria id no encontrado');
      });
  };
  saveProducts = async (req, res) => {
    try {
      let sectionType;
      let pictureFiles = req.files;
      if (pictureFiles) {
        let multiplePicturePromise = pictureFiles.map((picture) =>
          cloudinary.v2.uploader.upload(picture.path)
        );

        let imageResponses = await Promise.all(multiplePicturePromise);

        let imageURL = Array.from(
          imageResponses.map((picture) => picture.public_id)
        );
        sectionType = await this.ProductsDAO.guardar({
          ...req.body,
          foto: imageURL,
        });
      } else {
        sectionType = await this.ProductsDAO.guardar({
          ...req.body,
        });
      }

      res.status(201).json({
        success: true,
        id: sectionType,
        message: 'Producto creado!',
      });
    } catch (error) {
      res.status(500).send({
        message: 'failure',
        error,
      });
    }
  };
  deleteProduct = async (req, res) => {
    const id = req.params.id;
    const product = await this.ProductsDAO.mostrarId(id);
    try {
      if (product.foto) {
        product.foto.map((item) => {
          console.log('ITEM', item);
          cloudinary.v2.uploader
            .destroy('ecommerce/' + item, {
              type: 'upload',
              resource_type: 'image',
            })
            .then((result) => console.log(result));
        });
      }

      await this.ProductsDAO.eliminar('_id', id)
        .then(() => {
          res.status(200).send(`Eliminado  ${id}`);
        })
        .catch((err) => {
          this.message.errorNotFound(err, 'Error al eliminar  producto');
        });
    } catch (error) {
      this.message.errorNotFound(err, 'Error al eliminar  producto');
    }

  };

  editProductImagen = async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    console.log('FOTOS', body.dataObj);
    try {
      const newDetail = await this.ProductsDAO.actualizar(id, {
        foto: body.dataObj,
      });
    } catch (err) {
      this.message.errorNotFound(err, 'Error al eliminar foto producto');
    }
  };

  discountStock = async (req, res) => {
    const body = req.body;

    try {
      let doc = await this.ProductsDAO.mostrarId(body.id);
      let newStock = doc.stock - body.cantidad;

      await this.ProductsDAO.actualizar(body.id, { stock: newStock });
    } catch (error) {
      this.message.errorInternalServer(
        error,
        ' No se ha podido editar producto'
      );
    }
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
    let sectionType;
    try {
      let pictureFiles = req.files;
      if (pictureFiles) {
        let multiplePicturePromise = pictureFiles.map((picture) =>
          cloudinary.v2.uploader.upload(picture.path)
        );
        let imageResponses = await Promise.all(multiplePicturePromise);

        let doc = await this.ProductsDAO.mostrarId(id);

        let fotos = doc.foto.concat(imageResponses);

        sectionType = await this.ProductsDAO.actualizar(id, { foto: fotos });

        res.status(200).send(`Producto actualizado  ${id}`);
      } else {
        await this.ProductsDAO.actualizar(id, body).then(() =>
          res.status(200).send(`Producto actualizado  ${id}`)
        );
      }
    } catch (error) {
      this.message.errorInternalServer(
        error,
        ' No se ha podido editar producto'
      );
    }
  };
}

module.exports = ProductsController;
