const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },             // ชื่ออุปกรณ์
    serialNumber: { type: String, required: true, unique: true }, // หมายเลขซีเรียล (ไม่ซ้ำกัน)
    img: { type: String, default: '' },                  // รูปภาพ
    num: { type: Number, required: true },               // จำนวนที่มี
    status: { type: String, enum: ["available", "borrowed", "maintenance"], default: "available" }, // สถานะอุปกรณ์
}, { timestamps: true, versionKey: false });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
