const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 🔐 Token Generators
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
  });
};

// 🔸 Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed });

    res.status(201).json({ message: "User created", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔸 Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, //true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path : '/',
    });

    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔄 Refresh
router.get('/refresh', async (req, res) => {
  const token = req.cookies.refreshToken;
  console.log("🍪 Refresh token from cookie:", token);

  if (!token) {
    return res.status(403).json({ message: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    console.log("🧠 Decoded refresh token:", decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("🚫 User not found");
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15s" }
    );

    // (Optional) You can also rotate the refresh token if desired
    // but since you're not storing it, no need to regenerate unless for added security

    return res.json({ accessToken: newAccessToken });

  } catch (error) {
    console.log("❌ Refresh error:", error.message);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
});



// 🔓 Logout - clear refresh token cookie
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
});


module.exports = router;
