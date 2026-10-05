import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {

  const token = req.cookies.token;  //is there a token, cookie-parser reads the browser's cookie and puts them inside req.cookies


  if (!token) {
    return res.status(401).json({
      error: "Not authorized. Please login."   //no token 
    });
  }


  try {

    //if there is token 

    const decoded = jwt.verify(token, process.env.JWT_SECRET);   //verify the token with secret key stored in .env file

    //decoded is the information that was stored inside JWT by generateToken.js.

    req.user = decoded;  // if it is valid token decode it and store it in req.user

    next();

  } 
  catch (err) {

    //not a valid token

    return res.status(401).json({
      error: "Invalid or expired token."   
    });

  }

};

