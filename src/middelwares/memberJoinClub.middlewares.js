import { ClubDetail } from "../models/clubDetail.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SendError } from "../utils/sendError.js";

const memberJoinClub = asyncHandler(async (req, res, next) => {
  const { member_id, displayName, email, memberRole } = req?.auth?.member;
  const { club_id, clubName } = req?.auth?.club;
  const { paramsClubName } = req.params;

  if (
    [member_id, displayName, email, memberRole].some(
      (element) => !element?.trim()
    )
  ) {
    throw new SendError(400, "All credential are required");
  }

  if (clubName?.toLowerCase()?.trim() !== paramsClubName?.toLowerCase()?.trim()) {
    throw new SendError(401, `Unauthorized member for club ${paramsClubName}`);
  }

  const memberJoinClub = await ClubDetail.findOne({
    member: member_id,
    club: club_id,
  });

  if (!memberJoinClub) {
    throw new SendError(401, "Member not authentic to club");
  }

  next();
});

export { memberJoinClub };
