const logger = require('../../utils/loggers');
const nodemailer = require('nodemailer');
const request = require('request');
const CONFIG = require('../../utils/config');

function send(templateFile, subject, info) {

  let options = {
    uri: `http://localhost:8080/template/email/${templateFile}`,
    method: 'POST',
    json: info,
  };
  request(options, async function (error, response, body) {
    if (error) logger.error('Error al enviar email', error);
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: CONFIG.EMAIL.TEST_EMAIL,
        pass: CONFIG.EMAIL.PASS_EMAIL,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    let mailOptions = {
      from: 'Admin <noreply@admin.com>',
      to: CONFIG.EMAIL.ADMIN_EMAIL,
      subject: subject,
      html: body,
    };
    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) logger.error('Error al enviar email', error);
      logger.info('Email Enviado', info);
    });
  });
}

module.exports = send;
