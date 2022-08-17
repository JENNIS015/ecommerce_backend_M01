const APICustom = require('../classes/Error/customError');
const MongoDBClient = require('../classes/MongoDBClient.class');

class ServiceDAOMongoDB {
  constructor(nombreColeccion) {
    this.coleccion = nombreColeccion;
    this.conn = new MongoDBClient();
    this.message = new APICustom();
  }

  mostrarTodos = async () => {
    let response;
    try {
      await this.conn.connect();
      const docs = await this.coleccion.find({});
      if (docs == []) {
        response = [];
      } else {
        response = docs.map((doc) => doc);
      }

      return response;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al obtener mostrar todos`);
    } finally {
      this.message.infoSimple(`****Elemento listados ${response.length}****`);
    }
  };

  guardar = async (body) => {
    try {
      await this.conn.connect();
      const newObj = await this.coleccion.create(body);
      return newObj;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al guardar`);
    } finally {
      this.message.infoSimple('****Elemento guardado****');
    }
  };

  eliminar = async (condicion, id) => {
    try {
      await this.conn.connect();
      const elemento = await this.coleccion.deleteOne({ [condicion]: id });

      return elemento;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al eliminar id ${id}`);
    } finally {
      this.message.infoSimple(`Elemento elimindado id: ${id}`);
    }
  };

  mostrarId = async (id) => {
    try {
      await this.conn.connect();
      let doc = await this.coleccion.findOne({ _id: id });

      return doc;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al mostrar id`);
    } finally {
      this.message.infoSimple('****Mostrar por ID****');
    }
  };

  mostrarEmail = async (email) => {
    try {
      await this.conn.connect();
      let doc = await this.coleccion.findOne({ email: email });
      return doc;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al mostrar email`);
    } finally {
      this.message.infoSimple('****Mostrar por Email****');
    }
  };

  mostrarByEmail = async (id) => {
    try {
      await this.conn.connect();
      let doc = await this.coleccion.find({ 'usuario.email': { $eq: id } });

      return doc;
    } catch (error) {
      this.message.errorInternalServer(
        error,
        `Error al mostrar email por chat`
      );
    } finally {
      this.message.infoSimple('****Mostrar por Email CHAT****');
    }
  };

  mostrarCategoria = async (id) => {
    try {
      await this.conn.connect();
      let doc = await this.coleccion.find({ categoria: id });

      return doc;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al mostrar categoria`);
    } finally {
      this.message.infoSimple('****Se muestran por categoria****');
    }
  };

  mostrarTodasCategorias = async () => {
    try {
      await this.conn.connect();
      let cat = await this.coleccion.distinct('categoria');

      return cat;
    } catch (error) {
      this.message.errorInternalServer(
        error,
        `Error al mostrar todas categorias`
      );
    } finally {
      this.message.infoSimple('****Se muestran todas las categorias****');
    }
  };

  actualizar = async (id, body) => {
    try {
      await this.conn.connect();

      let doc = await this.coleccion.updateOne({ _id: id }, { $set: body });

      return doc;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al actualizar`);
    } finally {
      this.message.infoSimple('****Actualizado Exitoso****');
    }
  };

  actualizarPorEmail = async (email, body) => {
    try {
      await this.conn.connect();

      let doc = await this.coleccion.updateOne(
        { email: email },
        { $set: body }
      );

      return doc;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al actualizar`);
    } finally {
      this.message.infoSimple('****Actualizado Exitoso****');
    }
  };
}

module.exports = ServiceDAOMongoDB;
