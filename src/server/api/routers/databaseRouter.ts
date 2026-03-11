import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { MatchSchema } from "../validations";
import { db } from "~/server/db";
import { matches } from "~/server/db/schema";
import { and, asc, eq, notInArray } from "drizzle-orm";

export const database = createTRPCRouter({
  upsert: publicProcedure
    .input(z.array(MatchSchema))
    .mutation(async ({ input }) => {
      for (const match of input) {
        await db
          .insert(matches)
          .values({
            api_id: match.apiId,
            competition: match.competition,
            match_date: match.matchDate,
            opponent: match.opponent,
            opponent_shield: match.opponentShield,
            is_home: match.isHome,
            status: match.status as "SCHEDULED" | "FINISHED",
            scoreboard: match.scoreboard,
          })
          .onConflictDoUpdate({
            target: matches.api_id,
            set: {
              match_date: match.matchDate,
              status: match.status as "SCHEDULED" | "FINISHED",
              scoreboard: match.scoreboard,
              updated_at: new Date(),
            },
          });
      }
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
      })
      .from(matches)
      .where(eq(matches.status, "SCHEDULED"))
      .orderBy(asc(matches.match_date))
      .limit(3);
    return [...pastMatches, ...nextMatches];
  }),
});
