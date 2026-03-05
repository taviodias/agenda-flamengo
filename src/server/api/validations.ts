import z from "zod";

export const MatchSchema = z.object({
  apiId: z.string(),
  competition: z.string(),
  matchDate: z.date(),
  opponent: z.string(),
  isHome: z.boolean(),
  status: z.string(),
  scoreboard: z
    .object({
      home: z.number(),
      away: z.number(),
    })
    .optional(),
});
