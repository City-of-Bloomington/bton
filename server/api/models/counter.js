const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const countersSchema = new Schema({
  urlCode: { type: String, required: true },
  originalUrl: { type: String, required: true },
  hitDates: {
    type: Array,
    required: true,
  },
});

const counter = mongoose.model('counter', countersSchema);

export { counter };