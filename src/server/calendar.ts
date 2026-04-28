import { google, type calendar_v3 } from "googleapis";
import { env } from "~/env.js";
import { db } from "~/server/db";
import { userMatches } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import type { Match } from "~/types";

const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  "",
);

type MatchDB = Match & { id: number };

const formatToGoogleCalendarTime = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC", // Date on DB already in GMT-3, so we format as UTC to avoid timezone shifts
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const p = parts.reduce(
    (acc, part) => {
      acc[part.type] = part.value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
};

export async function syncUserCalendar(
  userRefreshToken: string,
  subscriberId: number,
  matchesToSync: MatchDB[],
) {
  oauth2Client.setCredentials({ refresh_token: userRefreshToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  let syncedCount = 0;

  for (const match of matchesToSync) {
    const matchDate = match.matchDate;
    const eventSummary = `${match.isHome ? "🏠" : "✈️"} Flamengo × ${match.opponent}`;

    const startTime = new Date(matchDate);
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

    const eventBody: calendar_v3.Schema$Event = {
      summary: eventSummary,
      location: match.location ?? "A definir",
      description: [
        `🏆 ${match.competition}`,
        `🏟️ ${match.location ?? "A definir"}`,
        "Evento criado por Agenda Flamengo. Para mais detalhes, acesse: https://agenda-flamengo.vercel.app",
      ].join("\n"),
      start: {
        dateTime: formatToGoogleCalendarTime(startTime),
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: formatToGoogleCalendarTime(endTime),
        timeZone: "America/Sao_Paulo",
      },
      colorId: "11",
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    const existingSync = await db.query.userMatches.findFirst({
      where: and(
        eq(userMatches.subscriberId, subscriberId),
        eq(userMatches.matchId, match.id),
      ),
    });

    try {
      if (existingSync?.googleEventId) {
        await calendar.events.update({
          calendarId: "primary",
          eventId: existingSync.googleEventId,
          requestBody: eventBody,
        });
        console.log(
          `Evento atualizado para o jogo ${match.id} do usuário ${subscriberId}`,
        );
      } else {
        const response = await calendar.events.insert({
          calendarId: "primary",
          requestBody: eventBody,
        });

        const newGoogleEventId = response.data.id;

        if (newGoogleEventId) {
          await db.insert(userMatches).values({
            subscriberId,
            matchId: match.id,
            googleEventId: newGoogleEventId,
          });
        }
        console.log(
          `Novo evento criado para o usuário ${subscriberId} do jogo ${match.id}`,
        );
      }
      syncedCount++;
    } catch (error) {
      console.error(
        `Erro ao sincronizar jogo ${match.id} para usuário ${subscriberId}:`,
        error,
      );
    }
  }

  return syncedCount;
}
