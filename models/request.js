const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected", "returned"], default: "pending" },
  requestDate: { type: Date, default: Date.now },
  approvalDate: { type: Date },
}, { timestamps: true, versionKey: false });

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;
