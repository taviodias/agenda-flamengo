import { google } from "googleapis";
import { env } from "~/env.js";

const REDIRECT_URI =
  process.env.NODE_ENV === "production"
    ? "https://agenda-flamengo.vercel.app/api/callback"
    : "http://localhost:3000/api/callback";

export const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
);
