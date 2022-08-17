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
  cookie = require('cookie'),
  config = require('./src/utils/config');


const app = express();
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
 

const RouterProduct = require('./src/routes/products.router'),
  RouterCart = require('./src/routes/cart.router'),
  RouterOrder = require('./src/routes/order.router'),
  RouterUser = require('./src/routes/user.router'),
  RouterEmail = require('./src/routes/email.router'),
  RouterViews = require('./src/routes/views.router'),
  RouterChat = require('./src/routes/chat.router'),
 chatSocket = require('./src/controllers/chatSocket');

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
/****  Configurando el cors de forma dinamica */
if (config.SERVER.entorno == 'development') {
  app.use(cors());
} else {
  app.use(
    cors({
      origin: `http://localhost:${config.SERVER.PORT}`,
      optionsSucessStatus: 200,
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
      maxAge: 1000 * 60 * 60 * 24, // one day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.session = req.session;
  next();
});



io.use(function (socket, next) {
  try {
    var data = socket.handshake || socket.request;
    if (!data.headers.cookie) {
      return next(new Error('Missing cookie headers'));
    }
    // console.log('cookie header ( %s )', JSON.stringify(data.headers.cookie));
    var cookies = cookie.parse(data.headers.cookie);
    //console.log('cookies parsed ( %s )', JSON.stringify(cookies));
    if (!cookies[COOKIE_NAME]) {
      return next(new Error('Missing cookie ' + COOKIE_NAME));
    }
    var sid = cookieParser.signedCookie(cookies[COOKIE_NAME], COOKIE_SECRET);
    if (!sid) {
      return next(new Error('Cookie signature is not valid'));
    }
    console.log('session ID ( %s )', sid);
    data.sid = sid;
    mongooseSessionStore.get(sid, function (err, session) {
      if (err) return next(err);
      if (!session) return next(new Error('session not found'));
      //  console.log("AIO", session)
      data.session = session;
      data.id = sid;
      next();
    });
  } catch (err) {
    console.error(err.stack);
    next(new Error('Internal server error'));
  }
});

chatSocket(io);


app.use('/', new RouterViews().start());

app.use('/', new RouterUser().start());
app.use('/api/productos', new RouterProduct().start());
app.use('/template/email', new RouterEmail().start());
app.use('/chat', new RouterChat().start());
app.use('/api/carrito', new RouterCart().start());
app.use('/api/pedido', new RouterOrder().start());

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
