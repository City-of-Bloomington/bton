require('dotenv').config();

// const shortid = require("shortid");

const authRole = (role) => (req, res, next) => {
  let isUser = req.session.user;

  if (!isUser || req.session.user.role !== role)
    return res.status(401).json('Unauthorized')

  next()
};

const redirectHome = (req, res, next) => {
  if (req.session.user)
    res.redirect(process.env.CLIENT_HOST);

  next()
};

module.exports = {
  authRole,
  redirectHome,
  // generate: function () {
  //   return shortid.generate();
  // }
}