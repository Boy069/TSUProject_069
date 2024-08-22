const express = require("express");
const router = express.Router();

const { getProduct, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");

// ดึงข้อมูลทั้งหมดของผลิตภัณฑ์
router.get("/", getProduct);

// เพิ่มผลิตภัณฑ์ใหม่
router.post("/", createProduct);

// แก้ไขข้อมูลผลิตภัณฑ์
router.put("/:id", updateProduct);

// ลบผลิตภัณฑ์
router.delete("/:id", deleteProduct);

module.exports = router