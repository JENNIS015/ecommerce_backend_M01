const express = require('express'),
  flash = require('connect-flash'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  MongoStore = require('connect-mongo'),
  cluster = require('cluster'),
  logger = require('./src/utils/loggers'),
  morgan = require('morgan'),
  path = require('path'),
  compression = require('compression'),
  exphbs = require('express-handlebars'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  config = require('./src/utils/config');

const app = express();
const { Server: HttpServer } = require('http');
const RouterCategory = require('./src/routes/category.router');
const httpServer = new HttpServer(app);

const RouterProduct = require('./src/routes/products.router'),
  RouterCart = require('./src/routes/cart.router'),
  RouterOrder = require('./src/routes/order.router'),
  RouterUser = require('./src/routes/user.router'),
  RouterEmail = require('./src/routes/email.router'),
  RouterViews = require('./src/routes/views.router');

app.use(compression());
app.use(morgan('tiny'));
 
app.engine(
  '.hbs',
  exphbs.engine({
    helpers: require('./public/js/helpers.js').helpers,
    extname: '.hbs',
    partialsDir: path.join(__dirname, 'public/views/partials'),
    layoutsDir: path.join(__dirname, 'public/views/layouts'),
  })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'public/views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json({ limit: '50mb', extended: true, parameterLimit: 50000 }));
// if (app.get('env') === 'production') {
app.set('trust proxy', 1);
// }
const corsOptions = {
  origin: [config.FRONT, config.ADMINPAGE, 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const mongooseSessionStore = MongoStore.create({
  mongoUrl: config.MONGO_DB.MONGO_CONNECT.url,
  ttl: 3600,
});

const COOKIE_SECRET = config.MONGO_DB.MONGO_CONNECT.secret;

app.use(
  session({
    secret: COOKIE_SECRET,
    proxy: true,
    store: mongooseSessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
      secure: process.env.NODE_ENV === 'production', // must be true if sameSite='none'
    },
  })
);



app.use(flash());
app.use(morgan('dev'));

app.use('/', new RouterUser().start());
app.use('/', new RouterViews().start());

app.use('/api/productos', new RouterProduct().start());
app.use('/template/email', new RouterEmail().start());

app.use('/api/carrito', new RouterCart().start());
app.use('/api/pedido', new RouterOrder().start());
app.use('/api/categorias', new RouterCategory().start());

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    logger.info('Mongoose disconnected on app termination');
    process.exit(0);
  });
});

/* ---------------------- Servidor ----------------------*/

if (config.SERVER.modoCluster && cluster.isPrimary) {
  logger.info('CPUs:', config.SERVER.numeroCPUs);
  logger.info(`Master ${process.pid} is running`);

  for (let i = 0; i < config.SERVER.numeroCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    logger.info(`${worker.process.pid} cerrado`);
  });
} else {
  const server = httpServer.listen(config.SERVER.PORT, () => {
    logger.info(
      `Servidor HTTP escuchado en puerto ${
        server.address().port
      }  - ${new Date().toLocaleString()}`
    );
  });

  server.on('error', (error) => logger.error(`Error en servidor ${error}`));
}
