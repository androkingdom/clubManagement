import { Announcement } from "../models/announcement.model.js";
import { Club } from "../models/club.model.js";
import { Member } from "../models/member.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import { SendError } from "../utils/sendError.js";
import { SendRes } from "../utils/sendRes.js";

const createAnnouncement = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!req?.auth?.member || !req?.auth?.club) {
    throw new SendError(403, "Unauthentic user entered");
  }

  const { member_id, role } = req.auth.member;
  const { club_id, clubName } = req.auth.club;

  if (!content?.trim()) {
    throw new SendError(404, "content not found!");
  }

  const resourceLocalPath = req?.file?.path;

  const resource = resourceLocalPath
    ? await cloudinaryUpload(resourceLocalPath)
    : "";

  const owner = await Member.findOne({
    _id: member_id,
    role
  });

  if (!owner) {
    throw new SendError(401, "Member Not found");
  }

  const sendToClub = await Club.findOne({
    _id: club_id,
    clubName: clubName,
  });

  if (!sendToClub) {
    throw new SendError(401, "Club Not found");
  }

  const newAnnouncementCreate = await Announcement.create({
    resource: resource?.secure_url || "",
    content: content.toLowerCase().trim(),
    owner: owner._id,
    sendTo: sendToClub._id,
  });

  if (!newAnnouncementCreate) {
    throw new SendError(500, "Cannot create db");
  }

  res
    .status(200)
    .json(new SendRes(200, "New Announcement Sent", newAnnouncementCreate));
});

export { createAnnouncement };