const dotenv = require('dotenv');
const os = require('os');

dotenv.config({
  silent: process.env.NODE_ENV === 'production',
});

module.exports = {
  MONGO_DB: {
    MONGO_CONNECT: {
      // db: process.env.DB_NAME
      url: process.env.MONGOURL,

      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
      },

      secret: process.env.SECRET_MONGO,
    },
  },
  JWT: { SECRET: process.env.PRIVATE_KEY_JWT },
  FRONT: process.env.FRONT,
  ADMINPAGE: process.env.ADMINPAGE,
  EMAIL: {
    TEST_EMAIL: process.env.TEST_EMAIL,
    PASS_EMAIL: process.env.PASS_EMAIL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    CHAT_ADMIN_EMAIL: process.env.CHAT_ADMIN_EMAIL || 'admin@test.com',
  },
  CLOUDINARY: {
 
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
    CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
    CLOUDINARY_CLOUD: process.env.CLOUDINARY_CLOUD  
  },
  TWILO: {
    AUTH_TOKEN: process.env.AUTH_TOKEN,
    ACCOUNT_SID: process.env.ACCOUNT_SID,
    TWILO_PHONE: process.env.TWILOPHONE,
    WHATSAPP_ADMIN: process.env.WHATSAPP_ADMIN,
    WHATSAPP_FROM: process.env.WHATSAPP_FROM,
  },

  SRV: {
    persistencia: process.env.PERSISTENCIA || 'mongodb',
  },

  SERVER: {
    numeroCPUs: process.env.NRO_CPU_MAX || os.cpus().length,
    PORT: parseInt(process.env.PORT) || 8080,
    modoCluster: process.env.MODO_CLUSTER == 'CLUSTER',
    logger: 'DEV',
    entorno: process.env.NODE_ENV || 'development',
  },
  ML: {
    token: process.env.ML_TOKEN,
  },
};
