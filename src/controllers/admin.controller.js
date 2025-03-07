import { COOKIES_OPTION } from "../constants.js";
import { Admin } from "../models/admin.model.js";
import { Club } from "../models/club.model.js";
import { ClubDetail } from "../models/clubDetail.model.js";
import { Member } from "../models/member.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { hashPassword, verifyPassword } from "../utils/bcrypt.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import { generateToken } from "../utils/jwtHelper.js";
import { SendError } from "../utils/sendError.js";
import { SendRes } from "../utils/sendRes.js";

const registerAdmin = asyncHandler(async (req, res) => {
  const { username, email, password, adminRegisterSecret } = req.body;

  if (
    [username, email, password, adminRegisterSecret].some(
      (element) => !element?.trim()
    )
  ) {
    throw new SendError(400, "All detailes are required");
  }

  if (adminRegisterSecret.trim() !== process.env.ADMIN_REGISTER_SECRET) {
    throw new SendError(409, "Admin secret key not matched");
  }

  const userExists = await Admin.findOne({
    $or: [
      { username: username.toLowerCase().trim() },
      { email: email.toLowerCase().trim() },
    ],
  });

  if (userExists) {
    throw new SendError(409, "User already exists");
  }

  const hashedPassword = await hashPassword(password);

  if (!hashedPassword) {
    throw new SendError(500, "Password hashing failed");
  }

  const admin = await Admin.create({
    username,
    email,
    password: hashedPassword,
  });

  if (!admin) {
    throw new SendError(400, "Cannot able to save date to database");
  }

  const newAdmin = { _id: admin._id, username, email, role: "Admin" };

  if (!newAdmin) {
    throw new SendError(400, "Error to find database");
  }

  const sessionToken = generateToken(
    {
      admin_id: admin._id,
      email,
      username,
      role: "Admin",
    },
    process.env.ADMIN_JWT_SECRET_KEY,
    process.env.ADMIN_JWT_EXPIRY
  );

  if (!sessionToken) {
    throw new SendError(500, "Failed to generate authentication token");
  }

  return res
    .status(200)
    .cookie("sessionToken", sessionToken, COOKIES_OPTION)
    .header("Authorization", `Bearer ${sessionToken}`)
    .json(new SendRes(200, "Admin Registered", newAdmin));
});

const adminLogin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((element) => !element?.trim())) {
    throw new SendError(400, "All credential are important");
  }

  const adminExists = await Admin.findOne({
    username: username.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
  });

  if (!adminExists) {
    throw new SendError(401, "Invalid username or email");
  }

  const validPassword = await verifyPassword(password, adminExists.password);

  if (!validPassword) {
    throw new SendError(401, "password didn't matched");
  }

  const authenticAdmin = {
    _id: adminExists._id,
    username: username.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    role: "Admin",
  };

  const sessionToken = generateToken(
    {
      admin_id: authenticAdmin._id,
      email,
      username,
      role: "Admin",
    },
    process.env.ADMIN_JWT_SECRET_KEY,
    process.env.ADMIN_JWT_EXPIRY
  );

  if (!sessionToken) {
    throw new SendError(500, "Error to generate token");
  }

  return res
    .status(200)
    .cookie("sessionToken", sessionToken, COOKIES_OPTION)
    .header("Authorization", `Bearer ${sessionToken}`)
    .json(new SendRes(200, "Admin Login", authenticAdmin));
});

const createNewMember = asyncHandler(async (req, res) => {
  const { displayName, email, password, memberRole } = req.body;

  if (
    [displayName, email, password, memberRole].some(
      (element) => !element?.trim()
    )
  ) {
    throw new SendError(400, "All credential are neccessary");
  }

  const userExists = await Member.findOne({ displayName }, { email });

  if (userExists) {
    throw new SendError(409, "User already exists");
  }

  const displayImageLocalPath = req.file?.path;

  if (!displayImageLocalPath) {
    throw new SendError(400, "Display image is neccessary");
  }

  const displayImage = await cloudinaryUpload(displayImageLocalPath);

  if (!displayImage) {
    throw new SendError(500, "Error in uploading file to cloudinary");
  }

  const hashedPassword = await hashPassword(password);

  if (!hashedPassword) {
    throw new SendError(401, "Cannot able to hash password");
  }

  const newMember = await Member.create({
    displayName,
    displayImage: displayImage.secure_url,
    email,
    password: hashedPassword,
    memberRole: memberRole.toLowerCase().trim()
  });

  if (!newMember) {
    throw new SendError(500, "Cannot able to save date to database");
  }

  const NewMember = await Member.findById(newMember._id).select("-password");

  if (!NewMember) {
    throw new SendError(500, "Error to find database");
  }

  return res.status(200).json(new SendRes(200, "New Member Added", NewMember));
});

const createNewClub = asyncHandler(async (req, res) => {
  const { clubName } = req.body;

  if (!clubName) {
    throw new SendError(400, "Club name is important");
  }

  const logoLocalPath = req.file?.path;

  if (!logoLocalPath) {
    throw new SendError(400, "Club logo is important");
  }

  const logo = await cloudinaryUpload(logoLocalPath);

  if (!logo) {
    throw new SendError(500, "Error occur in uploading club logo");
  }

  const clubExists = await Club.findOne({
    clubName,
  });

  if (clubExists) {
    throw new SendError(400, "Club already exists");
  }

  const club = await Club.create({
    logo: logo.secure_url,
    clubName: clubName,
  });

  if (!club) {
    throw new SendError(400, "Error in create club db");
  }

  return res.status(200).json(new SendRes(200, "New club added", club));
});

const addMemberToClub = asyncHandler(async (req, res) => {
  const { displayName, clubName } = req.body;

  if ([displayName, clubName].some((element) => !element?.trim())) {
    throw new SendError(400, "All credential are important");
  }

  const member = await Member.findOne({
    displayName: displayName.toLowerCase().trim(),
  }).select("-password");

  if (!member) {
    throw new SendError(400, "member not found");
  }

  const club = await Club.findOne({ clubName: clubName.toLowerCase().trim() });

  if (!club) {
    throw new SendError(400, "Club not found");
  }

  const existingMembership = await ClubDetail.findOne({
    member: member._id,
    club: club._id,
  });

  if (existingMembership) {
    throw new SendError(409, "Member already joined this club");
  }

  const clubDetail = await ClubDetail.create({
    member: member._id,
    club: club._id,
  });

  if (!clubDetail) {
    throw new SendError(500, "Error in creating club detail db");
  }

  return res
    .status(200)
    .json(new SendRes(200, "Member added to club", clubDetail));
});

export {
  registerAdmin,
  createNewMember,
  adminLogin,
  createNewClub,
  addMemberToClub,
};
