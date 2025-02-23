const jwt = require("jsonwebtoken");

const authMiddleware = (requiredRole) => (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];

  console.log(authorizationHeader);

  // Check if the Authorization header is present and correctly formatted
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user.role;
    console.log("Role", decoded.user);
    console.log("Required Role", requiredRole);
    // If `requiredRole` is specified, check if the user's role matches
    if (requiredRole && req.user.role !== requiredRole) {
      return res.status(403).json({ msg: "Access denied: insufficient role" });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
