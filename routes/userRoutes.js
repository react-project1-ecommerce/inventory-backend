import express from 'express';

import { registerUser, signIn } from '../controllers/userController.js';

const router = express.Router();

router.post('/registerUser', registerUser);

router.post('/signIn', signIn);

export default router;