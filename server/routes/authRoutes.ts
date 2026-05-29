import { Router } from "express";
import { signUp, login, logout, checkUser } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, checkUser);

export default router;