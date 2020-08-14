const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const urlsSchema = new Schema({
  owner: String,
  originalUrl: String,
  urlCode: String,
  shortUrl: String,
  hits: { type: Number, default: 0 },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now }
});

urlsSchema.pre('save', function (next) {
  var self = this;
  urls.find({ originalUrl: self.originalUrl }, function (err, docs) {
    if (!docs.length) { next(); } else {
      console.log('url exists: ', self.originalUrl);
      next('URL already exists.');
    }
  });
});

const whitelistUrlsSchema = new Schema({
  url: { type: String, required: true },
  owner: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
});

const urls = mongoose.model('urls', urlsSchema);
const whitelistUrls = mongoose.model('whitelistUrls', whitelistUrlsSchema);

export { urls, whitelistUrls };