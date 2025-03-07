import { Club } from "../models/club.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SendError } from "../utils/sendError.js";

const clubExists = asyncHandler(async (req, res, next) => {
  const { paramsClubName } = req.params;

  if (!paramsClubName?.toLowerCase().trim()) {
    throw new SendError(404, "Club name is required");
  }
  
  const findClub = await Club.findOne({
    clubName: paramsClubName?.toLowerCase().trim(),
  });
  
  if (!findClub) {
    throw new SendError(404, "Club doesn't exists");
  }

  req.auth = req.auth || {};
  req.auth.club = { club_id: findClub._id, clubName: findClub.clubName };

  next();
});

export { clubExists };
