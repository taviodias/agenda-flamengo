import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { MatchSchema } from "../validations";
import { db } from "~/server/db";
import { matches, subscribers } from "~/server/db/schema";
import { and, asc, eq, gt, notInArray } from "drizzle-orm";

export const database = createTRPCRouter({
  upsertMatch: publicProcedure
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
            location: match.location,
          })
          .onConflictDoUpdate({
            target: matches.api_id,
            set: {
              match_date: match.matchDate,
              status: match.status as "SCHEDULED" | "FINISHED",
              location: match.location,
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
    const now = new Date();
    now.setHours(now.getHours() - 3); //GMT -3
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
      .where(gt(matches.match_date, now));
    return upcoming;
  }),
  getSubscribers: publicProcedure.query(async () => {
    const subscribers = await db.query.subscribers.findMany();
    return subscribers;
  }),
});
