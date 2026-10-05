import jwt from "jsonwebtoken";

const generateToken = (id) => {

  //create the signed JWT , stores user ID as id, expires in 7 days

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default generateToken;