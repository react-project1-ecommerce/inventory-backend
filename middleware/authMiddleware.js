
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {

  // Read the JWT from the Authorization header
  //HTTP header names are case-insensitive

  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Not authorized. Please login."
    });
  }

  // Extract the token after "Bearer "
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store decoded user information in req.user
    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired token."
    });
  }

};
