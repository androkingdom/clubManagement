const DB_NAME = "Club_Manager";
const HASHING_SALT_ROUND = 10;
const COOKIES_OPTION = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
};

export { DB_NAME, HASHING_SALT_ROUND, COOKIES_OPTION };
