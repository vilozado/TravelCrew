import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  sendInvite,
  acceptInvitedMember,
} from "../controllers/inviteController";
const router = Router();
router.post("/accept", authMiddleware, acceptInvitedMember);
router.post("/:tripId", authMiddleware, sendInvite);

export default router;
