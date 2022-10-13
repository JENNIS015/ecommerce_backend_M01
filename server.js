const express = require('express'),
  flash = require('connect-flash'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  cookieParser = require('cookie-parser'),
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
app.use('/uploads', express.static('uploads'));
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
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json({ limit: '50mb', extended: true, parameterLimit: 50000 }));

/****  Configurando el cors de forma dinamica */
if (config.SERVER.entorno == 'development') {
  app.use(
    cors({
      origin: [config.FRONT, 'http://localhost:3001'],
      credentials: true,
    })
  );
} else {
  app.use(
    cors({
      origin: [config.FRONT, 'http://localhost:3001'],
      optionsSucessStatus: 200,
      credentials: true,
      methods: 'GET, PUT, POST, DELETE',
    })
  );
}

const mongooseSessionStore = MongoStore.create({
  mongoUrl: config.MONGO_DB.MONGO_CONNECT.url,
  ttl: 3600,
});

const COOKIE_NAME = 'sid';
const COOKIE_SECRET = config.MONGO_DB.MONGO_CONNECT.secret;

app.use(cookieParser(COOKIE_SECRET));
app.use(
  session({
    name: COOKIE_NAME,
    store: mongooseSessionStore,
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // one day
      secure: false,
      httpOnly: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

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
