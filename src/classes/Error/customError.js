const logger = require('../../utils/loggers');

class APICustom {
  errorNotFound = (error, mensaje) => {
    logger.error(mensaje, error);
    return {
      success: false,
      message: 'Oops no se ha encontrado',
      customMessage: mensaje,
      code: 404,
    };
  };
  errorInternalServer = (error, mensaje) => {
    logger.error(mensaje, error);
    return {
      success: false,
      message: 'Error del servidor 401',
      customMessage: mensaje,
      code: 401,
    };
  };
  errorAuth = (error, mensaje) => {
    logger.error(mensaje, error);
    return {
      success: false,
      message: 'Error acceso',
      customMessage: mensaje,
      code: 401,
    };
  };
  errorInvalid = () => {
 
    return {
      success: false,
      message: 'Error acceso',
 
      code: 422,
    };
  };

  errorServer = (error, mensaje) => {
    logger.error(error, mensaje);
    return {
      success: false,
      message: 'Error del servidor',
      customMessage: mensaje,
      code: 500,
    };
  };

  infoSimple = (mensaje) => {
    logger.info(mensaje);
  };
}

module.exports = APICustom;
