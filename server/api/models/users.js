const mongoose = require('mongoose'),
        Schema = mongoose.Schema;

const usersSchema = new Schema({
  dateCreated:    Date,
  lastLoginDate:  Date,
  username:       String,
  role:           String,
  email:          String,
});

const users = mongoose.model("users", usersSchema);

export { users };