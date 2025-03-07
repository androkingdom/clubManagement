import bcrypt from "bcrypt";
import { HASHING_SALT_ROUND } from "../constants.js";

const hashPassword = async (password) => {
  return await bcrypt.hash(password, HASHING_SALT_ROUND);
};

const verifyPassword = async (originalPassword, hashedPassword) => {
  return await bcrypt.compare(originalPassword, hashedPassword);
};

export {
  hashPassword,
  verifyPassword,
};
