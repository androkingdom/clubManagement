import { COOKIES_OPTION } from "../constants.js";
import { Member } from "../models/member.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwtHelper.js";
import { SendError } from "../utils/sendError.js";
import { SendRes } from "../utils/sendRes.js";

const memberLogin = asyncHandler(async (req, res) => {
  const { displayName, email, password } = req.body;

  if ([displayName, email, password].some((element) => !element?.trim())) {
    throw new SendError(400, "All credential required");
  }

  const memberExist = await Member.findOne({
    displayName,
    email,
  });

  if (!memberExist) {
    throw new SendError(401, "Member does not exsits");
  }

  const validPassword = await verifyPassword(password, memberExist.password);

  if (!validPassword) {
    throw new SendError(401, "Password didn't matched");
  }

  const authenticMember = await Member.findById(memberExist?._id).select(
    "-password"
  );

  const sessionToken = generateToken(
    {
      member_id: authenticMember._id,
      displayName,
      email,
      memberRole: authenticMember.memberRole,
    },
    process.env.MEMBER_JWT_SECRET_KEY,
    process.env.MEMBER_JWT_EXPIRY
  );

  if (!sessionToken) {
    throw new SendError(500, "Cannot able to generate member token");
  }

  return res
    .status(200)
    .cookie("sessionToken", sessionToken, COOKIES_OPTION)
    .header("Authorization", `Bearer ${sessionToken}`)
    .json(new SendRes(200, "Member logged in", authenticMember));
});

export { memberLogin };
