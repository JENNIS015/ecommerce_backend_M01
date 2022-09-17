const send = require('../../config/configEmail');
const config = require('../../../utils/config');
//email to admin
function sendNewPasswordEmail(token) {
  const templateFile = 'templateLogin',
    subject = `Restauración de clave de usuario`,
    info = {
      msg: `Haz click aqui para cambiar la contraseña 
       Si no fue solicitado, ignora este correo.`,
      button: config.FRONT + '/reset/' + token,
    };
  send(templateFile, subject, info);
}

module.exports = sendNewPasswordEmail;
