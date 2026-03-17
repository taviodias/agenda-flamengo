import { NextResponse } from "next/server";
import { google } from "googleapis";
import { oauth2Client } from "~/server/google";
import { api } from "~/trpc/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/?error=access_denied", request.url));
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    const userInfo = await oauth2.userinfo.get();
    const email = userInfo.data.email;

    if (!email || !tokens.refresh_token) {
      console.error("Faltam dados essenciais:", {
        email,
        hasRefreshToken: !!tokens.refresh_token,
      });
      return NextResponse.redirect(
        new URL("/?error=missing_data", request.url),
      );
    }
    await api.db.upsertSubscriber({
      email,
      refreshToken: tokens.refresh_token,
    });

    return NextResponse.redirect(new URL("/?success=true", request.url));
  } catch (error) {
    console.error("Erro no callback do Google:", error);
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
  }
}
