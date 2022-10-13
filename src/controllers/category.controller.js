const APICustom = require('../classes/Error/customError');
const CategoryDAOFactory = require('../classes/Category/CategoryDAOFactory.class');

class CategoryController {
  constructor() {
    this.CategoryDAO = CategoryDAOFactory.get();
    this.message = new APICustom();
  }
  getCategorias = async (req, res) => {
    try {
      res
        .status(200)
        .json({ categoria: await this.CategoryDAO.mostrarTodos() });
    } catch (error) {
      this.message.errorNotFound(error, 'categorias no encontradas');
    }
  };

  newCategoria = async (req, res) => {
 
    await this.CategoryDAO.guardar(req.body)

      .then(() => {
        res.status(200).json({ status: true, result: 'guardado' });
      })
      .catch((error) => {
        this.message.errorInternalServer(
          error,
          'No se ha podido guardar el producto'
        );
      });
  };

  deleteById = async (req, res) => {
    const id = req.params.id;

    try {
      const data = await this.CategoryDAO.eliminar('id', id);
      res.status(200).send(data);
    } catch (err) {
      this.message.errorNotFound(err, 'Error al eliminar categoria');
    }
  };

}
module.exports = CategoryController;
