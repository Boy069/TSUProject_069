// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.register = async (req, res) => {
  const { username, password, name, email, tel, role } = req.body;

  // ตรวจสอบบทบาทที่ป้อนเข้ามา
  const validRoles = ["requester", "approver"];
  if (role && !validRoles.includes(role)) {
    return res.status(400).send("Invalid role");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      name,
      email,
      tel,
      role: role || 'requester', // ใช้บทบาท 'requester' เป็นค่าเริ่มต้น
    });
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const tmpuser = await User.findOne({ email });
    if (!tmpuser) return res.status(400).send("User not found");
    const isMatch = await bcrypt.compare(password, tmpuser.password);
    if (!isMatch) return res.status(400).send("Invalid credentials");
    const role = tmpuser.role; // ไม่จำเป็นต้องใช้ await ที่นี่
    if (!role) return res.status(400).send("Role not found");

    // สร้าง accessToken โดยรวม role ใน payload
    const accessToken = jwt.sign(
      { userId: tmpuser._id, role: role }, // เพิ่มข้อมูล role ใน payload
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" } // เวลาหมดอายุของ accessToken
    );
    // สร้าง refreshToken
    const refreshToken = jwt.sign(
      { userId: tmpuser._id, role: role }, // เพิ่มข้อมูล role ใน payload
      process.env.REFRESH_TOKEN_SECRET
    );
    // const accessToken = jwt.sign(
    //   { userId: tmpuser._id}, // เพิ่มข้อมูล role ใน payload
    //   process.env.ACCESS_TOKEN_SECRET,
    //   { expiresIn: "15m" } // แก้ไขเวลาหมดอายุให้ถูกต้อง
    // );
    // const refreshToken = jwt.sign(
    //   { userId: tmpuser._id },
    //   process.env.REFRESH_TOKEN_SECRET
    // );
    res.json({user: tmpuser, accessToken, refreshToken, role});
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.refresh = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { userId: user.userId, role: user.role }, // เพิ่มข้อมูล role ใน payload
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  });
};
