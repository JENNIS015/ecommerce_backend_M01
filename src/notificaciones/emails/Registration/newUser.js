const send = require('../../config/configEmail');
 
async function sendEmail(newUser) {
 
    const templateFile = 'templateRegistration',
      toEmail = newUser.email,
      subject = 'Nuevo Usuario',
      info = {name:newUser.name};

   return await send(templateFile,  subject, info);
}

module.exports =  sendEmail  
