import express from 'express';
 import AuthControllers from '../controllers/authController';
import Validator from '../utils/validator';

const router = express.Router();

router.post("/user/login",Validator.loginValidator, AuthControllers.loginUser)

export default router;