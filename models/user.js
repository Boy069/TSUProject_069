const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, require: true },
  password: { type: String, require: true },
  name: { type: String, require: true },
  email: { type: String, require: true },
  tel: { type: String, require: true },
  role: { type: String, enum: ["requester", "approver"], default: "requester" } // แยกประเภทผู้ใช้
},
{ timeseries: true, versionKry: false }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
