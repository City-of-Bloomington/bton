require('dotenv').config();

const axios = require('axios'),
  { users } = require('../models/users'),
  { redirectHome,
    authRole } = require('../middleware'),
  { roles } = require('../roles'),
  router = require('express').Router(),
  mongoose = require('mongoose');

router.get('/login', redirectHome, (req, res, next) => {

  let encodedRedirectURL = encodeURIComponent(`${process.env.API_HOST}/auth/verify/`);

  res.redirect(`${process.env.CITY_WEBSITE_URL}/cas/login?service=${encodedRedirectURL}`);
});

router.get('/verify', (req, res, next) => {
  let casTicket = req.query.ticket;

  let encodedServiceURL = encodeURIComponent(`${process.env.API_HOST}/auth/verify/`);

  axios.get(`${process.env.CITY_WEBSITE_URL}/cas/serviceValidate?service=${encodedServiceURL}&ticket=${casTicket}&format=json`, {
    timeout: 2000,
  })
    .then((response) => {
      if (response.status == 200) {

        req.session.user = {
          user: response.data.serviceResponse.authenticationSuccess.user
        };

        console.log('VERIFIED req.session.user', req.session.user);
        console.log('VERIFIED req.session.user.user', req.session.user.user);

        users.findOne({ username: req.session.user.user })
          .then((currentUser) => {
            if (currentUser) {
              console.log('CurrentUser,', currentUser)

              req.session.isLoggedIn = true;

              let update = {
                lastLoginDate: new Date(),
              };

              // users.findOneAndUpdate(currentUser.username, update, { new: true }, function (err, res) {
              //   if (err) {
              //     console.log('findOneAndUpdate e', err);
              //   } else {
              //     console.log('find and UPDATE,', res);
              //   }
              // });

              req.session.user = currentUser;
              req.session.save();
            } else {
              const newUser = new users({
                dateCreated: new Date(),
                lastLoginDate: new Date(),
                username: req.session.user.user,
                role: 'default',
                email: req.session.user.user + '@bloomington.in.gov',
              });

              newUser.save()
                .then((userRes) => {
                  console.log('newUser Save res :: ', userRes);
                  req.session.isLoggedIn = true;
                  req.session.user = userRes;
                  req.session.save();
                })
                .catch((err) => { console.log('newUser Save err :: ', err) });
            }
          })
          .catch((err) => { console.log("Couldn't find a user") });

        res.redirect(process.env.CLIENT_HOST);
      } else {
        res.send(response.data);
      }
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message);
      } else {
        return next(err);
      }
    })


});


router.get('/user', (req, res) => {
  console.log('req.session', req.session);
  console.log('req.session.user', req.session.user);
  // console.log('req.session.user.user', req.session.user.user);

  if (req.session.user) {
    res.status(200).json({
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user
    });
  } else {
    res.status(200).json({ isLoggedIn: false, user: null });
  }
});


router.post('/user', authRole(roles.admin), (req, res) => {
  if (req.session.user.user == req.body.ogUser) {

    let update = {
      role: req.body.role,
    };

    users.findOneAndUpdate(req.session.user.user, update, { new: true }, function (err, response) {
      if (err) {
        console.log('findOneAndUpdate e', err);
      } else {
        res.status(200).json({
          user: response
        });
      }
    });
  } else {
    console.log('You got here, but is that you?');
    res.status(401).json({ error: 'You got here, but is that you?' });
  }
});


router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log('logout err', err)
      return res.redirect(process.env.CLIENT_HOST);
    }

    res.clearCookie(process.env.SESSION_NAME);
    res.redirect(`${process.env.CITY_WEBSITE_URL}/cas/logout?url=${process.env.CLIENT_HOST}`);
  });

  console.log('loggedout', req.session)
});

module.exports = router;