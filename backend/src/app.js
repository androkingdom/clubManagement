import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieparser());

// Include routers
import MemberRoute from "./routes/member.router.js";
import AdminRouter from "./routes/admin.router.js";
import ClubRouter from "./routes/club.router.js";

// Using routers
app.use("/api/v1/member", MemberRoute);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/club", ClubRouter);

export { app };
