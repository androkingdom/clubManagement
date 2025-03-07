import mongoose, { Schema } from "mongoose";
import { SendError } from "../utils/sendError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/jwtHelper.js";
import { Admin } from "../models/admin.model.js";

const adminAuth = asyncHandler(async (req, res, next) => {
  const token =
    req.headers?.authorization?.split(" ")[1] || req.cookies.sessionToken;
  if (!token) {
    throw new SendError(401, "Unauthorized Admin Entered");
  }

  const decoded = verifyToken(token, process.env.ADMIN_JWT_SECRET_KEY);

  if (!decoded) {
    throw new SendError(500, "Cannot able to decode token");
  }

  if (decoded?.role !== "Admin") {
    throw new SendError(403, "Only admin can access this route");
  }

  const adminUser = await Admin.findById({ _id: decoded?.admin_id }).select("_id username email");

  if (!adminUser) {
    throw new SendError(404, "Admin not found");
  }

  req.auth = req.auth || {}; 
  req.auth.admin = decoded;
  next();
});

export { adminAuth };
