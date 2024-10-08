const Product = require("../models/product");
const { verifyAdmin } = require('../middleware/authMiddleware');

// ดึงข้อมูลทั้งหมดของผลิตภัณฑ์
exports.getProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// เพิ่มผลิตภัณฑ์ใหม่
exports.createProduct = async (req, res) => {
  const { name, img, num, status } = req.body;

  const product = new Product({name, img, num, status})
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// แก้ไขข้อมูลผลิตภัณฑ์
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, img, num, status } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, img, num, status },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ลบผลิตภัณฑ์
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
