import express from 'express';
import * as userController from '../controllers/user.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

export default router;