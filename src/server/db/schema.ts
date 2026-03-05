import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import type { Scoreboard } from "~/types";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `fla_sync_${name}`);

//* TABELAS DE INSCRIÇÃO E TOKENS

export const subscribers = createTable("subscriber", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  refresh_token: text("refresh_token").notNull(),
  created_at: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

//* TABELAS PARTIDAS

export const matches = createTable("match", {
  id: serial("id").primaryKey(),
  api_id: varchar("api_id", { length: 255 }).notNull().unique(),
  opponent: varchar("opponent", { length: 255 }).notNull(),
  opponent_shield: varchar("opponent_shield", { length: 255 }).notNull(),
  competition: varchar("competition", { length: 255 }).notNull(),
  is_home: boolean("is_home").notNull().default(true),
  match_date: timestamp("match_date", { mode: "date" }).notNull(),
  status: varchar("status", { enum: ["FINISHED", "SCHEDULED"] }).notNull(),
  scoreboard: json("scoreboard").$type<Scoreboard>(),
  created_at: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const userMatches = createTable(
  "user_match",
  {
    subscriberId: serial("subscriberId")
      .notNull()
      .references(() => subscribers.id, { onDelete: "cascade" }),
    matchId: integer("matchId")
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    googleEventId: varchar("googleEventId", { length: 255 }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.subscriberId, t.matchId] })],
);
