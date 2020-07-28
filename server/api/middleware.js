require('dotenv').config();

const redirectHome = (req, res, next) => {
  if (req.session.user)
    res.redirect(process.env.CLIENT_HOST);

  next()
};

const authRole = (...roles) => (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json('Unauthorized')
  }

  const hasRole = roles.find(role => req.session.user.role === role);

  if (!hasRole) {
    return res.status(401).json('Unauthorized')
  }

  next()
}

module.exports = {
  authRole,
  redirectHome
}