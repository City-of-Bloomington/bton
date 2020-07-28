const mongoose = require('mongoose'),
        Schema = mongoose.Schema;

// const applicationsSchema = new Schema({
//   dateCreated:  Date,
//   name:         String,
//   department:   String,
//   role:         String,
//   url:          String,
//   shortBody:    String,
//   body:         String,
//   sections:     Object,
// });

// const applications = mongoose.model("applications", applicationsSchema);

// export { applications };

const countersSchema = new Schema({
  _id: { type: String, required: true },
  count: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', countersSchema);

export { Counter };