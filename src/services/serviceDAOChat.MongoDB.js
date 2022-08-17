const APICustom = require('../classes/Error/customError');
const MongoDBClient = require('../classes/MongoDBClient.class');
class ServiceDAOChatMongoDB {
  constructor(nombreColeccion) {
    this.coleccion = nombreColeccion;
    this.conn = new MongoDBClient();
    this.message = new APICustom();
  }

  save = async (data) => {
    try {
      await this.conn.connect();
      const doc = await this.coleccion.create(data);
      return doc;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al encontrar`);
    } finally {
      this.message.infoSimple('***Creado****');
    }
  };
  saveOnlineUser = async (data) => {
    try {
      await this.conn.connect();
      let query = { email: data.email };
      let update = { $set: data };
      let options = { upsert: true, new: true, setDefaultsOnInsert: true };

      const doc = await this.coleccion.findOneAndUpdate(query, update, options);
      return doc;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al encontrar`);
    } finally {
      this.message.infoSimple('***Creado****');
    }
  };

  deleteCollection = async (data) => {
    try {
      await this.conn.connect();

      const doc = await this.coleccion.deleteOne(data);
      return doc;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al eliminar`);
    } finally {
      this.message.infoSimple('***Usuario eliminado****');
    }
  };

  findCollection = async (data) => {
    try {
      await this.conn.connect();

      const doc = await this.coleccion.find({
        //finds the entire chat history between the two people
        from: { $in: [data.fromUser, data.toUser] },
        to: { $in: [data.fromUser, data.toUser] },
      });

      return doc;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al encontrar`);
    }
  };
  findConnectByUser = async (toEmail) => {
    try {
      await this.conn.connect();

      const data = await this.coleccion.findOne({ email: toEmail });
      return data;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al encontrar`);
    } finally {
      this.message.infoSimple('***findChannelConnectByUser****');
    }
  };

  findUsersConnect = async () => {
    try {
      await this.conn.connect();

      const data = await this.coleccion.find();
      return data;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al encontrar`);
    } finally {
      this.message.infoSimple('***Show users connect****');
    }
  };
}
module.exports = ServiceDAOChatMongoDB;
