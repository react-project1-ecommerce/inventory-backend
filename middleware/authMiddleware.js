
import admin from "../config/firebaseAdmin.js";

export const authMiddleware = async (req, res, next) => {
  
  const authHeader = req.headers.authorization;

  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   return res.status(401).json({
  //     error: "Not authorized. Please login.",
  //   });
  // }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Firebase UID identifies the authenticated user
    req.user = {
      id: decodedToken.uid,
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    next();

  } catch (err) {
    console.error("Firebase token verification failed:", err.message);

    return res.status(401).json({
      error: "Invalid or expired Firebase token.",
    });
  }
};
