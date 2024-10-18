const Request = require("../models/request");
const Product = require("../models/product");

// ส่งคำขอ
exports.createRequest = async (req, res) => {
  console.log("Requester User:", req.user); // แสดงข้อมูล user
  console.log("User ID:", req.user.userId); // แสดง User ID
  const { productId } = req.body;

  // ตรวจสอบว่า req.user มี userId หรือไม่
  if (!req.user || !req.user.userId) {
      return res.status(400).json({ message: "Requester ID is required." });
  }

  try {
      const product = await Product.findById(productId);
      if (!product || product.status !== "available") {
          return res.status(400).json({ message: "Product is not available" });
      }

      const request = new Request({
          requester: req.user.userId, // ใช้ userId ที่ได้จาก token
          product: productId,
      });

      await request.save();
      res.status(201).json(request);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// ดึงคำขอทั้งหมดของผู้ใช้
exports.getRequests = async (req, res) => {
  try {
    const request = await Request.find({ requester: req.user.userId }).populate(
      "product"
    );
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ส่งคืนคำขอที่ได้รับการอนุมัติแล้ว
exports.returnRequest = async (req, res) => {
  const requestId = req.params.requestId; // ดึง requestId จาก URL parameter
  try {
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // ตรวจสอบว่าสถานะของคำขอต้องเป็น "approved" หรือไม่
    if (request.status !== "approved") {
      return res.status(400).json({ message: "Request must be approved to return." });
    }

    request.status = "returned"; // เปลี่ยนสถานะคำขอเป็น "returned"
    request.returnDate = Date.now(); // บันทึกวันที่คืน
    await request.save();

    // อัปเดตสถานะผลิตภัณฑ์
    const product = await Product.findById(request.product);
    if (product) {
      product.status = "available"; // เปลี่ยนสถานะผลิตภัณฑ์เป็น "available"
      await product.save();
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ดึงคำขอทั้งหมดที่ถูกคืนของผู้ใช้
exports.getReturnedRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user.userId, status: "returned" }).populate("product");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// อนุมัติคำขอ
exports.approveRequest = async (req, res) => {
  if (req.user.role !== 'approver') {
    return res.status(403).json({ message: 'Forbidden: You are not allowed to approve requests' });
  }

  const requestId = req.params.requestId; // ดึง requestId จาก URL parameter
  const { decision } = req.body; // decision: "approved" or "rejected"
  try {
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = decision;
    request.approvalDate = Date.now();
    await request.save();

    // อัปเดตสถานะผลิตภัณฑ์
    const product = await Product.findById(request.product);
    if (decision === "approved") {
      product.status = "borrowed";
    } else {
      product.status = "available"; // ถ้าปฏิเสธ ให้กลับสู่สถานะว่าง
    }
    await product.save();

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ปฏิเสธคำขอ
exports.rejectRequest = async (req, res) => {
  if (req.user.role !== 'approver') {
    return res.status(403).json({ message: 'Forbidden: You are not allowed to reject requests' });
  }

  const requestId = req.params.requestId; // ดึง requestId จาก URL parameter
  const { decision } = req.body; // decision: "approved" or "rejected"
  try {
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = decision;
    request.approvalDate = Date.now();
    await request.save();

    // อัปเดตสถานะผลิตภัณฑ์
    const product = await Product.findById(request.product);
    if (decision === "rejected") {
      product.status = "available"; // ถ้าปฏิเสธ ให้กลับสู่สถานะว่าง
    }
    await product.save();

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


