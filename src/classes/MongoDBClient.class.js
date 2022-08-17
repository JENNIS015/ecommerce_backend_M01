const APICustom = require('./Error/customError'),
  config = require('../utils/config'),
  mongoose = require('mongoose'),
  logger = require('../utils/loggers');

class MongoDBClient {
  constructor() {
    this.client = mongoose;
    this.message = new APICustom();
  }

  connect = async () => {
    try {
      //Conectado
      if (this.client.connection.readyState == 1) {
        logger.info('***Conexion en curso****');
      }
      //Desconectado
      if (this.client.connection.readyState == 0) {
        await this.client
          .connect(
            config.MONGO_DB.MONGO_CONNECT.url,
            config.MONGO_DB.MONGO_CONNECT.options
          )

          .then((db) => {
            const timeID = Date.now();
            logger.info(`Base de datos conectada  ${timeID}`);
            db.connection.on('error', (err) => {
              logger.error(`Base de datos error:  ${err}`);
            }); // <- print nothing
            db.connection.on('disconnected', () => {
              logger.info(`Base de datos desconectada`);
            }); // <- print once
            db.connection.on('reconnected', () => {
              logger.info(`Base de datos re-conectada`);
            }); // <- never printed
          });
      }
    } catch (error) {
      this.message.errorServer(error, 'Error al conectarse a mongodb');
      process.exit(1);
    }
  };

  
}
module.exports = MongoDBClient;
