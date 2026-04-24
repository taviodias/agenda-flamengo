import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { MatchSchema } from "../validations";
import { db } from "~/server/db";
import { matches, subscribers } from "~/server/db/schema";
import { and, asc, eq, inArray, notInArray, sql } from "drizzle-orm";

export const database = createTRPCRouter({
  upsertMatches: publicProcedure
    .input(z.array(MatchSchema))
    .mutation(async ({ input }) => {
      console.log("Buscando jogos existentes no banco...");
      const apiIds = input.map((m) => m.apiId);
      const existingMatches =
        apiIds.length > 0
          ? await db
              .select()
              .from(matches)
              .where(inArray(matches.api_id, apiIds))
          : [];
      const existingMap = new Map(existingMatches.map((m) => [m.api_id, m]));

      const toUpsert = input
        .filter((match) => {
          const existing = existingMap.get(match.apiId);
          if (!existing) {
            return true;
          }

          const isMatchDateSame =
            existing.match_date.getTime() === match.matchDate.getTime();
          const isStatusSame = existing.status === match.status;
          const isLocationSame = existing.location === match.location;
          const isScoreboardSame =
            JSON.stringify(existing.scoreboard) ===
            JSON.stringify(match.scoreboard);

          return (
            !isMatchDateSame ||
            !isStatusSame ||
            !isLocationSame ||
            !isScoreboardSame
          );
        })
        .map((match) => ({
          api_id: match.apiId,
          competition: match.competition,
          match_date: match.matchDate,
          opponent: match.opponent,
          opponent_shield: match.opponentShield,
          is_home: match.isHome,
          status: match.status as "SCHEDULED" | "FINISHED",
          scoreboard: match.scoreboard,
          location: match.location,
        }));
      if (toUpsert.length === 0) {
        console.log("Nenhum jogo para sincronizar.");
        return [];
      }
      console.log(`Upsert de ${toUpsert.length} jogos no Supabase...`);
      const upsertedMatches = await db
        .insert(matches)
        .values(toUpsert)
        .onConflictDoUpdate({
          target: matches.api_id,
          set: {
            match_date: sql`excluded.match_date`,
            status: sql`excluded.status`,
            scoreboard: sql`excluded.scoreboard`,
            location: sql`excluded.location`,
            updated_at: sql`CURRENT_TIMESTAMP`,
          },
        })
        .returning({
          apiId: matches.api_id,
          competition: matches.competition,
          matchDate: matches.match_date,
          opponent: matches.opponent,
          opponentShield: matches.opponent_shield,
          isHome: matches.is_home,
          status: matches.status,
          location: matches.location,
          scoreboard: matches.scoreboard,
          id: matches.id,
        });
      return upsertedMatches;
    }),
  cleanOldMatches: publicProcedure
    .input(z.array(MatchSchema))
    .query(async ({ input }) => {
      const idsToKeep = input.map((m) => m.apiId);
      if (idsToKeep.length > 0) {
        await db
          .delete(matches)
          .where(
            and(
              eq(matches.status, "FINISHED"),
              notInArray(matches.api_id, idsToKeep),
            ),
          );
      }
    }),
  upsertSubscriber: publicProcedure
    .input(
      z.object({
        email: z.string(),
        refreshToken: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const subsInserted = await db
        .insert(subscribers)
        .values({
          email: input.email,
          refresh_token: input.refreshToken,
        })
        .onConflictDoUpdate({
          target: subscribers.email,
          set: { refresh_token: input.refreshToken },
        })
        .returning();
      return subsInserted[0];
    }),
  matchesCards: publicProcedure.query(async () => {
    const pastMatches = await db
      .select({
        apiId: matches.api_id,
        competition: matches.competition,
        matchDate: matches.match_date,
        opponent: matches.opponent,
        opponentShield: matches.opponent_shield,
        isHome: matches.is_home,
        status: matches.status,
        scoreboard: matches.scoreboard,
        location: matches.location,
      })
      .from(matches)
      .where(eq(matches.status, "FINISHED"))
      .orderBy(asc(matches.match_date));
    const nextMatches = await db
      .select({
        apiId: matches.api_id,
        competition: matches.competition,
        matchDate: matches.match_date,
        opponent: matches.opponent,
        opponentShield: matches.opponent_shield,
        isHome: matches.is_home,
        status: matches.status,
        scoreboard: matches.scoreboard,
        location: matches.location,
      })
      .from(matches)
      .where(eq(matches.status, "SCHEDULED"))
      .orderBy(asc(matches.match_date))
      .limit(3);
    return [...pastMatches, ...nextMatches];
  }),
  upcomingMatches: publicProcedure.query(async () => {
    const upcoming = await db
      .select({
        id: matches.id,
        apiId: matches.api_id,
        competition: matches.competition,
        matchDate: matches.match_date,
        opponent: matches.opponent,
        opponentShield: matches.opponent_shield,
        isHome: matches.is_home,
        status: matches.status,
        scoreboard: matches.scoreboard,
        location: matches.location,
      })
      .from(matches)
      .where(eq(matches.status, "SCHEDULED"));
    return upcoming;
  }),
  getSubscribers: publicProcedure.query(async () => {
    const subscribers = await db.query.subscribers.findMany();
    return subscribers;
  }),
});
