require("dotenv").config();

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const urlsSchema = new Schema({
  owner: { type: String, required: true },
  originalUrl: { type: String, required: true, unique: true },
  urlCode: { type: String, required: true, unique: true },
  shortUrl: { type: String, required: true, unique: true },
  label: { type: String, default: "" },
  delayPreview: { type: Boolean, default: false },
  hits: { type: Number, default: 0 },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now }
});

urlsSchema.pre("save", function(next) {
  var self = this;

  urls.find({ originalUrl: self.originalUrl }, function(err, docs) {
    if (!docs.length) {
      next();
    } else {
      next({ message: "Url already exists.", url: docs });
    }
  });
});

const whitelistUrlsSchema = new Schema({
  url: { type: String, required: true, unique: true },
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
