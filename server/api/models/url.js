require("dotenv").config();

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const urlsSchema = new Schema({
  owner: String,
  originalUrl: String,
  urlCode: String,
  shortUrl: String,
  delayPreview: { type: Boolean, default: false },
  hits: { type: Number, default: 0 },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now }
});

urlsSchema.pre("save", function(next) {
  var self = this;

  urls.find({ originalUrl: self.originalUrl }, function(err, docs) {
    if (!docs.length) {
      // whitelistUrls.find({ url: self.originalUrl }, function(err, url) {
      //   if (!url.length) {
      //     next({
      //       message: `Url not ${process.env.PASSLIST_TERM} accepted.`,
      //       url: null
      //     });
      //   } else {
      //     next();
      //   }
      // });
      next();
    } else {
      next({ message: "Url already exists.", url: docs });
    }
  });
});

const whitelistUrlsSchema = new Schema({
  url: { type: String, required: true },
  owner: { type: String, required: true },
  createdDate: { type: Date, default: Date.now }
});

whitelistUrlsSchema.pre("save", function(next) {
  var self = this;
  whitelistUrls.find({ url: self.url }, function(err, url) {
    if (!url.length) {
      next();
    } else {
      next("URL already exists.");
    }
  });
});

const urls = mongoose.model("urls", urlsSchema);
const whitelistUrls = mongoose.model("whitelistUrls", whitelistUrlsSchema);

export { urls, whitelistUrls };
