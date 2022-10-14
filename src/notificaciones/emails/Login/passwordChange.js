const send = require('../../config/configEmail');
 
//email to admin
function passwordChange(email) {
  const templateFile = 'templateLogin',
    subject = `Tu contraseña ha sido cambiada `,
    info = {
      msg:
        `Hola,\n\n` +
        `Este correo es una confirmación que para la cuenta` +
        email +
        `la contraseña ha sido cambiada correctamente`,
    };
  send(templateFile, subject, info);
}


module.exports = passwordChange;
