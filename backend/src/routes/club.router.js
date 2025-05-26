import { Router } from "express";
import { clubExists } from "../middelwares/clubExists.middlewares.js";
import { mentorAuth } from "../middelwares/mentorAuth.middlewares.js";
import { upload } from "../middelwares/multer.middelware.js";
import { createAnnouncement } from "../controllers/club.controller.js";
import { memberJoinClub } from "../middelwares/memberJoinClub.middlewares.js";

const router = Router();

// Member create announcement ( mentor - only )
router
  .route("/:paramsClubName/create-announcement")
  .post(mentorAuth, clubExists, memberJoinClub, upload.single("resource"), createAnnouncement);

export default router;
