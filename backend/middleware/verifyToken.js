const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("🔒 No access token found in headers.");
    return res.status(401).json({ message: "Access token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  if (err) {
    if (err.name === 'TokenExpiredError') {
      console.log("⌛ Token expired");
      return res.status(401).json({ message: "Token expired" });
    }
    console.log("❌ Token error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
  
  console.log("✅ Token verified successfully.");
  req.user = decoded;
  next();
});
};

module.exports = verifyToken;


