let dotenvExpand = require('dotenv-expand');
dotenvExpand(require('dotenv').config());

const pkg = require('../package'),
  { Nuxt,
    Builder } = require('nuxt'),
  config = require('../nuxt.config.js'),
  https = require('https'),
  http = require('http'),
  fs = require('fs'),
  isProd = (process.env.NODE_ENV === 'production'),
  isKube = (process.env.NODE_KUBE === 'true'),
  nuxt = new Nuxt(config);

config.dev = !isProd;

envMsg = config.dev ? 'Development' : 'Production',
  dividerMsg = `🌹\xa0\xa0🌹\xa0\xa0🌹\xa0\xa0🛠️\xa0\xa0⛓️\xa0\xa0👩‍💻\xa0🔮\xa0👨‍💻\xa0⛓️\xa0\xa0🛠️\xa0\xa0🌹\xa0\xa0🌹\xa0\xa0🌹`,
  dividerStars = `★\xa0\xa0`,
  starRepeatCount = 15;

// Build only in dev mode with hot-reloading
if (config.dev) {
  new Builder(nuxt).build()
    .then(listen)
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
} else { listen() }

function listen() {
  // is app running inside of a container, launch http server if so
  if (isKube) {
    http.createServer(nuxt.render).listen(process.env.NUXT_PORT, () => {
      console.log(`\nHTTP MODE: Running via container\n`)
    });
  }
  else {
    let options = {
      key: fs.readFileSync(process.env.CERT_KEY_PATH, 'utf8'),
      cert: fs.readFileSync(process.env.CERT_CRT_PATH, 'utf8')
    };
    https.createServer(options, nuxt.render).listen(process.env.NUXT_PORT, () => {
      console.log(`\nHTTPS MODE: Running via dev\n`)
    });
  }

  console.log(`\n\n${dividerMsg}\n`
    + `${dividerStars.repeat(starRepeatCount)}\n`
    + `App:  ${pkg.prettyName}\n`
    + `Env:  ${envMsg}\n`
    + `Who:  ${pkg.company}\n`
    + `Repo: ${pkg.repository.url}\n`
    + `Url:  ${process.env.CLIENT_HOST}`
    + `\n${dividerStars.repeat(starRepeatCount)}\n`
    + `${dividerMsg}\n\n`);
}