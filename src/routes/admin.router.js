import { Router } from "express";
import {
  createNewMember,
  adminLogin,
  registerAdmin,
  createNewClub,
  addMemberToClub,
} from "../controllers/admin.controller.js";

import { adminAuth } from "../middelwares/adminAuth.middlewares.js";
import { upload } from "../middelwares/multer.middelware.js";

const router = Router();

// Admin Register Route
router.route("/register").post(registerAdmin);

// Admin Create New Member Route
router
  .route("/create-member")
  .post(adminAuth, upload.single("displayImage"), createNewMember);

// Admin Login Route
router.route("/login").post(adminLogin);

// Admin Create New Club Route
router
  .route("/create-club")
  .post(adminAuth, upload.single("logo"), createNewClub);

// Admin Adding Member To Club Route
router.route("/member-to-club").post(adminAuth, addMemberToClub);

export default router;
