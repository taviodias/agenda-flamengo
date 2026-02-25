import { NextResponse } from "next/server";
import { oauth2Client } from "~/server/google";

export async function GET() {
  const scopes = [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });

  return NextResponse.redirect(authorizationUrl);
}
