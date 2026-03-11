import z from "zod";

export const MatchSchema = z.object({
  apiId: z.string(),
  competition: z.string(),
  matchDate: z.date(),
  opponent: z.string(),
  opponentShield: z.string(),
  isHome: z.boolean(),
  status: z.string(),
  scoreboard: z
    .object({
      home: z.number(),
      away: z.number(),
      penalties: z
        .object({
          home: z.number(),
          away: z.number(),
        })
        .nullable(),
    })
    .nullable(),
});
