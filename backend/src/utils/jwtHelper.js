import jwt from "jsonwebtoken";
import { SendError } from "./sendError.js";

/**
 * Generate a JWT token for any user type.
 * @param {Object} payload - User data (id, displayName, role).
 * @param {string} secretKey - The secret key to sign the token.
 * @param {string} expiresIn - Expiry time (e.g., "7d", "1h").
 * @returns {string} - The signed JWT token.
 */

const generateToken = (payload, secret, expiresIn) => {
  if (!payload || !secret) {
    throw new SendError(401, "payload or secret not given");
  }
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify and decode a JWT token.
 * @param {string} token - The token to verify.
 * @param {string} secretKey - The secret key used to sign the token.
 * @returns {Object} - Decoded token data.
 */

const verifyToken = (token, secretKey) => {
  if (!token || !secretKey) {
    throw new SendError(401, "Token or secret key not given");
  }

  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new SendError(403, "Token expired or invalid");
  }
};

export { generateToken, verifyToken };
