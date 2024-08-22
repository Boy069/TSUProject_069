const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    img: { type: String, default: '' }, 
    num: { type: Number, required: true },
    status: { type: String, required: true },
}, { timestamps: true, versionKey: false });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
