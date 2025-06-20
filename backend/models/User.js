// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
//   refreshToken: String // optional if you want to store/blacklist
});

module.exports = mongoose.model("User", UserSchema);
