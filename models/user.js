const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, require: true },
  password: { type: String, require: true },
  name: { type: String, require: true },
  email: { type: String, require: true },
  tel: { type: String, require: true },
  role: { type: String, require: false } // เพิ่ม field role
},
{ timeseries: true, versionKry: false }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
