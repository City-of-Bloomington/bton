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

const urls = mongoose.model('urls', urlsSchema);

export { urls };