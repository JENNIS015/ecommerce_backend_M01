const e = require('connect-flash');
const twilio = require('twilio');
const CONFIG = require('../../utils/config');
const client = twilio(CONFIG.TWILO.ACCOUNT_SID, CONFIG.TWILO.AUTH_TOKEN);
const logger = require('../../utils/loggers');

async function msgSend(number, order) {
  try {
    const message = await client.messages.create({
      body: `Hemos recibido su pedido  se encuentra en estado PROCESANDO`,
      from: CONFIG.TWILO.TWILO_PHONE,
      to: number,
    });
  } catch (e) {
    logger.error('SMS CLIENT', e);
  }
  try {
    //whatsapp to admin
    const smsAdmin = await client.messages
      .create({
        from: `whatsapp:${CONFIG.TWILO.WHATSAPP_FROM}`,
        to: `whatsapp:${CONFIG.TWILO.WHATSAPP_ADMIN}`,
        body: `Nuevo Pedido nº${order.id}  - ${order.buyerID} `,
      })
      .then((message) => logger.warn('SID', message.sid))
      .catch((err)=> logger.error('Error Twilo',err))
      .done();
  } catch (e) {
    logger.error('SMS admin', e);
  }
}

module.exports = msgSend;
