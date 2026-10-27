
import admin from "../config/firebaseAdmin.js";

export const authMiddleware = async (req, res, next) => {
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Not authorized. Please login.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.verifyIdToken(token);

    // Firebase UID identifies the authenticated user

    //Firebase includes email_verified in its decoded ID token
    //We're now storing that status in req.user.emailVerified so our backend can check it.

  req.user = {
  id: decodedToken.uid,
  uid: decodedToken.uid,
  email: decodedToken.email,
  emailVerified: decodedToken.email_verified,
};

//backend now blocks unverified users from protected API routes, while allowing the initial registration request.

   // Allow unverified users to register their profile.
if (
  !req.user.emailVerified &&
  req.originalUrl.includes("/registerUser")
) {
  return next();
}

// Block unverified users from other protected API routes.
if (!req.user.emailVerified) {
  return res.status(403).json({
    error: "Please verify your email before accessing this feature.",
  });
}

next();

  } catch (err) {
    console.error("Firebase token verification failed:", err.message);

    return res.status(401).json({
      error: "Invalid or expired Firebase token.",
    });
  }
};
