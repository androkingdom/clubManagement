import { Router } from "express";
import { memberLogin } from "../controllers/member.controller.js";
import { memberAuth } from "../middelwares/memberAuth.middlewares.js";
import { upload } from "../middelwares/multer.middelware.js";

const router = Router();

// Member login route
router.route("/login").post(memberLogin);

export default router;
