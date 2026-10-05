import express from 'express';

import { registerUser, signIn , logoutUser, getCurrentUser } from '../controllers/userController.js';

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

//registerUser and signIn are not protected routes

router.post('/registerUser', registerUser);

router.post('/signIn', signIn);


//a protected route for testing purpose

router.get('/protected', authMiddleware, (req,res)=>{

	// if no valid JWT , the middleware returns 401 Unauthorized and the protected route never executes
	//next() inside middleware does not execute so res.json() does not execute either

	res.json({
       message:"You are authenticated!",
       user: req.user
	});

});


//authMiddleware protects /currentUser. Only users with a valid JWT can access it.

router.get("/currentUser", authMiddleware, getCurrentUser);  



router.post('/signOut', logoutUser);

export default router;