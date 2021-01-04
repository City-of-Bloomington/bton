require("dotenv").config();

const { urls, whitelistUrls } = require("../models/url"),
  { counter } = require("../models/counter"),
  { redirectHome, authRole } = require("../middleware"),
  { roles } = require("../roles"),
  router = require("express").Router(),
  validUrl = require("valid-url");

import { nanoid, customAlphabet } from "nanoid";

// Get all URLs in the system.
router.get("/urls", authRole(roles.admin, roles.default), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit); // Make sure to parse the limit to number
    const skip = parseInt(req.query.skip); // Make sure to parse the skip to number

    let urlRes = await urls
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdDate: -1 })
      .exec();
    let totalUrls = await urls.countDocuments();

    res.status(200).json({ urlRes, total: totalUrls });
  } catch (error) {
    res.status(500).send(error);
  }
});


// Get all URLs in the system via Username.
router.get("/urls/user/:id", authRole(roles.admin, roles.default), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit); // Make sure to parse the limit to number
    const skip = parseInt(req.query.skip); // Make sure to parse the skip to number

    const username = req.params.id;

    let urlRes = await urls
      .find({ owner: username})
      .skip(skip)
      .limit(limit)
      .sort({ createdDate: -1 })
      .exec();
    let totalUrls = await urls.countDocuments({ owner: username });

    res.status(200).json({ urlRes, total: totalUrls });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/url/:id", (req, res) => {
  urls
    .find({
      originalUrl: {
        $regex: req.params.id,
        $options: "i"
      }
    })
    .then(url => {
      res.status(200).json(url);
    })
    .catch(err => {
      res.status(200).json("URL not found");
    });
});

router.get("/url/short/:id", (req, res) => {
  urls
    .find({ urlCode: req.params.id })
    .then(url => {
      if (url.length) {
        res.status(200).json(url);
      } else {
        res.status(404).json({ error: "Short Url not found." });
      }
    })
    .catch(err => {
      res.status(404).json({ error: "Short Url GET fail." });
    });
});

router.post("/url", authRole(roles.admin, roles.default), (req, res) => {
  if (validUrl.isUri(req.body.url)) {
    console.log("Valid Base Url format");

    // const urlCode = nanoid(5);
    const nanoid = customAlphabet(
      "-_~!1234567890aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ",
      5
    );

    let urlCode = nanoid();

    let shortUrl = `${process.env.CLIENT_HOST}/${urlCode}`;

    const newURL = new urls({
      owner: req.session.user.username,
      originalUrl: req.body.url,
      urlCode: urlCode,
      shortUrl: shortUrl,
      delayPreview: req.body.delayPreview,
      createdDate: new Date(),
      updatedDate: new Date()
    });

    newURL
      .save()
      .then(urlRes => {
        res.status(200).json(urlRes);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json("Invalid Base Url format");
  }
});

// Edit URL in the system by ID.
router.post(
  "/url/:id/edit",
  authRole(roles.admin, roles.default),
  (req, res, next) => {
    let findById = { _id: req.body.id },
      update = {
        $set: {
          delayPreview: req.body.delayPreview,
          originalUrl: req.body.originalUrl,
          updatedDate: new Date()
        }
      };

    urls.findOne(findById, (err, result) => {
      if (err) {
        res.status(404).json({ saved: false, error: err });
      } else {
        if (req.session.user.role == roles.admin) {
          urls.updateOne(findById, update, { new: true }, (err, updateRes) => {
            if (err) {
              res
                .status(200)
                .json({ saved: false, update: "doh. we had an error." });
            } else {
              res.status(200).json({ saved: true, update: updateRes });
            }
          });
        } else if (req.session.user.role == roles.default) {
          if (req.session.user.username == result.owner) {
            urls.updateOne(
              findById,
              update,
              { new: true },
              (err, updateRes) => {
                if (err) {
                  res
                    .status(200)
                    .json({ saved: false, update: "doh. we had an error." });
                } else {
                  res.status(200).json({ saved: true, update: updateRes });
                }
              }
            );
          } else {
            res.status(200).json({ saved: false, update: "not the owner" });
          }
        }
      }
    });
  }
);

router.get("/short/:id", (req, res) => {
  let countBy = 1;

  urls
    .findOneAndUpdate(
      { urlCode: req.params.id },
      {
        $inc: {
          hits: countBy
        }
      }
    )
    .then(url => {
      let updateBy = { urlCode: url.urlCode },
        update = {
          $push: {
            hitDates: new Date()
          }
        };

      counter.findOneAndUpdate(
        updateBy,
        update,
        { new: true },
        (counterErr, counterRes) => {
          if (counterErr) {
            console.log("counter findOneAndUpdate fail", counterErr);
          } else {
            if (!counterRes) {
              const newCounter = new counter({
                hitDates: new Date(),
                urlCode: url.urlCode,
                originalUrl: url.originalUrl
              });

              newCounter
                .save()
                .then(counterRes => {
                  res.status(200).json({
                    url: url.originalUrl,
                    delayPreview: url.delayPreview
                  });
                })
                .catch(err => {
                  console.log("newCounter Save err :: ", err);
                });
            } else {
              res
                .status(200)
                .json({ url: url.originalUrl, delayPreview: url.delayPreview });
            }
          }
        }
      );
    })
    .catch(err => {
      res.status(400).json("URL not found");
    });
});

// Delete a short URL in the system by ID.
router.delete("/short/:id", authRole(roles.admin), (req, res) => {
  urls
    .find({ _id: req.params.id })
    .deleteOne()
    .then(urlres => {
      res.status(200).json({ message: "Removed" });
    })
    .catch(err => {
      res.status(200).json({ error: err });
    });
});

router.post("/url/whitelist", authRole(roles.admin), (req, res) => {
  if (validUrl.isWebUri(req.body.url)) {
    const newWhitelistUrl = new whitelistUrls({
      owner: req.session.user.username,
      url: req.body.url,
      createdDate: new Date()
    });

    newWhitelistUrl
      .save()
      .then(urlRes => {
        res.status(200).json(urlRes);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json("Invalid Base Url format");
  }
});

router.get(
  "/urls/whitelist",
  authRole(roles.admin, roles.default),
  async (req, res) => {
    try {
      let urlRes = await whitelistUrls.find().sort({ createdDate: -1 }).exec();
      let totalUrls = await whitelistUrls.countDocuments();

      res.status(200).json({ urlRes, total: totalUrls });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.delete(
  "/urls/whitelist/delete/:id",
  authRole(roles.admin),
  (req, res) => {
    whitelistUrls
      .deleteOne({ _id: req.params.id })
      .then(urlres => {
        res.status(200).json({ message: "Removed" });
      })
      .catch(err => {
        res.status(200).json({ error: err });
      });
  }
);

module.exports = router;
