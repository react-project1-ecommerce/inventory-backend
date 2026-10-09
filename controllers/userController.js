import User from "../models/userModel.js"; 
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs"; 

export const registerUser=async(req,res)=>{

   try {

    const { name,email,password,department } = req.body;

   const existUser = await User.findOne({email}).exec();

   if (existUser)
   {
   	 return res.status(401).json({

   	 	error: "User already exists."
   	 });

   }

   const hashedPassword = await bcrypt.hash(password, 10); 

   const newUser = await User.create({
                  name,
                  email,
                  password: hashedPassword,
                  department:department,
                  });

   return res.json(req.body);
}
catch(err)
{

   console.log(err);

   return res.status(500).json({

      error: err.message

   });

}

}

export const signIn=async(req,res)=>{

   try{

     const { email, password } = req.body;

     const user = await User.findOne({email});

     console.log("USER FOUND:", user);

     if (user && await bcrypt.compare(password, user.password))
     {

       const token = generateToken(user._id);  

       //JWT is now stored in a http-only cookie named 'token'
       // for local development secure:false, later when we deploy our project with HTTPS will change that to secure:true

       //lax blocks most cross-site cookie requests, browser restricts cross-site sending of JWT cookie
       //This helps protect application against CSRF (Cross-Site Request Forgery) attacks.

       // response no longer contains the JWT
       // JWT is stored in HTTP-ONLY cookie, not in react/javascript code
       // Browser receives and stores the cookie
       // Backend sends a Set-Cookie response header containing the JWT to the browser


res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


       res.json({

         _id: user.id,
         name: user.name,
         email:user.email,
         department: user.department,
         isAdmin: user.isAdmin,
         procurement: user.procurement,

       });

     }
     else
     {

     return res.status(401).json({
        error: "Invalid Email and Password !!"
      });

     }

   }
   catch(err)
   {
     
       console.log(err);

       return res.status(500).json({
          error: err.message
       });
   }
}


export const logoutUser = async (req, res) => {

  try {

   //the logout function replace that cookie with an empty value and an expiry date in the past

   //the browser removes the JWT cookie

    //clearCookie explicitly tells Express explicitly to clear the cookie

    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "lax",
      secure: false,
    });

    console.log("Logout successful");

    return res.json({
      message: "Logout successful"
    });


  } 
  catch (err) {

    console.log(err);

    return res.status(500).json({
      error: err.message
    });

  }

};


export const getCurrentUser = async (req, res) => {

  try {

    //This retrieves the user's latest information from the database.
    //JWT payload { id } is decoded by middleware, so user ID is accessed using req.user.id

    const user = await User.findById(req.user.id)
                      .select("-password");   // the password hash is excluded from the query result

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    //send these user details to the frontend

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      isAdmin: user.isAdmin,
      procurement: user.procurement
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      error: err.message
    });

  }

};