const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { createRequest, getRequests, approveRequest, rejectRequest, returnRequest, getReturnedRequests } = require('../controllers/requestController');

// ใช้ middleware สำหรับตรวจสอบ token
router.post("/", authenticateToken, createRequest); // สำหรับการสร้างคำขอใหม่
router.get("/", authenticateToken, getRequests); // ดึงคำขอทั้งหมด

// ใช้ method PUT สำหรับการอัปเดตคำขอ และส่ง requestId ผ่าน URL parameter
router.put("/:requestId/approve", authenticateToken, approveRequest); // อนุมัติคำขอ
router.put("/:requestId/reject", authenticateToken, rejectRequest); // ปฏิเสธคำขอ
// Route สำหรับคืนคำขอ
router.patch("/requests/:requestId/return", authenticateToken,returnRequest);
// Route สำหรับดึงคำขอที่ถูกคืนของผู้ใช้
router.get("/requests/returned", authenticateToken,getReturnedRequests);

module.exports = router;
