require('dotenv').config();

const { urls } = require('../models/url'),
  { redirectHome,
    authRole } = require('../middleware'),
  { roles } = require('../roles'),
  router = require('express').Router(),
  validUrl = require('valid-url');

import { nanoid } from 'nanoid'

// Get all URLs in the system.      
router.get('/urls', authRole(roles.admin, roles.default), async (req, res) => {
  try {
    let result = await urls.find().exec();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/url/:id', (req, res) => {

  urls.find({
    "originalUrl": {
      "$regex": req.params.id,
      "$options": "i"
    }
  })
    .then((url) => {
      res.status(200).json(url)
    })
    .catch((err) => { res.status(200).json('URL not found') })
});

router.post('/url', authRole(roles.admin, roles.default), (req, res) => {
  if (validUrl.isUri(req.body.url)) {
    console.log('Valid Base Url format');

    const urlCode = nanoid(5);
    let shortUrl = `${process.env.CLIENT_HOST}/${urlCode}`;

    const newURL = new urls({
      owner: req.session.user.username,
      originalUrl: req.body.url,
      urlCode: urlCode,
      shortUrl: shortUrl,
      createdDate: new Date(),
      updatedDate: new Date(),
    });

    newURL.save()
      .then((urlRes) => {
        res.status(200).json(urlRes);
      })
      .catch((err) => {
        res.status(400).json(err);
      });

  } else {
    res.status(400).json('Invalid Base Url format');
  }
});

router.get('/short/:id', (req, res) => {
  let countBy = 1;

  urls.findOneAndUpdate({ urlCode: req.params.id }, {
    $inc: {
      hits: countBy
    }
  })
    .then((url) => {
      res.status(200).json(url.originalUrl);
    })
    .catch((err) => {
      res.status(400).json('URL not found');
    })
});

// Delete a short URL in the system by ID.      
router.delete('/short/:id', authRole(roles.admin), (req, res) => {
  urls.find({ _id: req.params.id })
    .deleteOne()
    .then((urlres) => { res.status(200).json({ message: 'Removed' }) })
    .catch((err) => { res.status(200).json({ error: err }) })
});

module.exports = router;