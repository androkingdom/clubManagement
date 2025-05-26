import { asyncHandler } from "../utils/asyncHandler.js";
import { SendError } from "../utils/sendError.js";
import { Member } from "../models/member.model.js";
import { verifyToken } from "../utils/jwtHelper.js";

const mentorAuth = asyncHandler(async (req, res, next) => {
  const token =
    req.headers?.authorization?.split(" ")[1] || req.cookies.sessionToken;
  if (!token) {
    throw new SendError(401, "Unauthorized Member Entered");
  }

  const decoded = verifyToken(token, process.env.MEMBER_JWT_SECRET_KEY);

  if (!decoded) {
    throw new SendError(401, "cannot member decode token");
  }

  if (decoded?.memberRole !== "mentor") {
    throw new SendError(403, "mentor only route");
  }

  const memberUser = await Member.findOne({ _id: decoded?.member_id }).select("_id displayName email");

  if (!memberUser) {
    throw new SendError(404, "member not found");
  }

  req.auth = req.auth || {}; 
  req.auth.member = decoded;
  next();
});

export { mentorAuth };
