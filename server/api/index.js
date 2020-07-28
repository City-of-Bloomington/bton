require('dotenv').config();

const express = require('express'),
  app = express(),
  fs = require('fs'),
  https = require('https'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  mongoose = require('mongoose'),
  authRoutes = require('./routes/auth'),
  apiRoutes = require('./routes/url'),
  { roles } = require('./roles'),
  { authRole } = require('./middleware');

mongoose.connect(process.env.MONGODB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
  .then((res) => {
    console.log('🦡 🦡 🦡  Mongoose Connected  🦡 🦡 🦡\n\n');
  })
  .catch((err) => {
    console.log('🦡 🦡 🦡 🦡 Mongoose Error: ', err)
  });

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_HOST);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session(
  {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      maxAge: 1000 * 60 * 60 * 2,
    },
    store: new MongoStore({
      url: process.env.MONGODB_HOST,
      collection: process.env.SESSION_COLLECTION
    })
  }
));

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ data: 'eGovPortal API' });
});

https.createServer({
  key: fs.readFileSync(process.env.CERT_KEY_PATH, 'utf8'),
  cert: fs.readFileSync(process.env.CERT_CRT_PATH, 'utf8')
}, app)
  .listen(process.env.API_PORT, () => {
    console.log('\n\n✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨',
      `\n✨✨✨✨✨API SERVER @ ${process.env.API_PORT} ✨✨✨✨`,
      '\n✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨\n\n');
  })