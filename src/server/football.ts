import * as cheerio from "cheerio";
import { api } from "~/trpc/server";
import type { Match } from "~/types";

const PLACAR_FLAMENGO_BASE_URL =
  "https://www.placardefutebol.com.br/time/flamengo";

function parseDate(date: string, time?: string) {
  const now = new Date();
  now.setHours(now.getHours() - 3); //* Change to GMT-3
  if (!time) {
    if (date === "ontem") {
      const matchDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1,
      );
      return matchDate;
    }
    const [_, dayMonth] = date.split(",").map((d) => d.trim()) as [
      string,
      string,
    ];
    const [day, month] = dayMonth.split("/").map(Number);
    if (!day || !month) {
      throw new Error("Data em formato inválido.");
    }
    const matchDate = new Date(now.getFullYear(), month - 1, day);
    if (month - 1 > now.getMonth()) {
      matchDate.setFullYear(matchDate.getFullYear() - 1);
    }
    return matchDate;
  }
  const [hours, minutes] = time.split(":").map(Number);
  const matchDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours ?? 0,
    minutes ?? 0,
  );
  if (date === "hoje") {
    return matchDate;
  }
  if (date === "amanhã") {
    matchDate.setDate(matchDate.getDate() + 1);
    return matchDate;
  }
  const [_, dayMonth] = date.split(",").map((d) => d.trim()) as [
    string,
    string,
  ];
  const [day, month] = dayMonth.split("/").map(Number);
  if (!day || !month) {
    throw new Error("Data em formato inválido.");
  }
  if (month - 1 < now.getMonth()) {
    matchDate.setFullYear(now.getFullYear() + 1);
  }
  matchDate.setDate(day);
  matchDate.setMonth(month - 1);
  return matchDate;
}

async function nextMatches() {
  const res = await fetch(PLACAR_FLAMENGO_BASE_URL + "/proximos-jogos");
  if (!res.ok) {
    throw new Error(`Erro ${res.status} no fetch dos próximos jogos.`);
  }
  const matches: Match[] = [];
  const html = await res.text();
  const $ = cheerio.load(html);
  $(".match__lg").each((idx, match) => {
    const $match = $(match);
    const competition = $match.find(".match__lg_card--league").text();
    const [date, time] = $match
      .find(".match__lg_card--datetime")
      .text()
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean) as [string, string];

    const homeTeam = $match.find(".match__lg_card--ht-name").text();
    const awayTeam = $match.find(".match__lg_card--at-name").text();
    const isHome = homeTeam === "Flamengo";
    const opponent = isHome ? awayTeam : homeTeam;
    const matchDate = parseDate(date, time);
    const apiId = Buffer.from(`${opponent}-${matchDate.getTime()}`).toString(
      "base64",
    );
    matches.push({
      apiId,
      competition,
      matchDate,
      opponent,
      isHome,
      status: "SCHEDULED",
    });
  });
  return matches;
}

async function lastTwoMatches() {
  const res = await fetch(PLACAR_FLAMENGO_BASE_URL + "/ultimos-jogos");
  if (!res.ok) {
    throw new Error(`Erro ${res.status} no fetch dos jogos anteriores.`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const matches: Match[] = [];
  $(".match__lg")
    .slice(0, 2)
    .each((idx, match) => {
      const $match = $(match);
      const scoreBoard = $match
        .find(".match__lg_card--scoreboard")
        .text()
        .trim();
      const date = $match.find(".match__lg_card--date").text();
      const competition = $match.find(".match__lg_card--league").text();
      const [hScore, aScore] = scoreBoard.split("-").map(Number);
      if (typeof hScore !== "number" || typeof aScore !== "number") {
        throw new Error("Placar não encontrado ou em formato inválido!");
      }
      const homeTeam = $match.find(".match__lg_card--ht-name").text();
      const awayTeam = $match.find(".match__lg_card--at-name").text();
      const isHome = homeTeam === "Flamengo";
      const opponent = isHome ? awayTeam : homeTeam;
      const matchDate = parseDate(date);
      const apiId = Buffer.from(`${opponent}-${matchDate.getTime()}`).toString(
        "base64",
      );
      matches.push({
        apiId,
        competition,
        matchDate,
        opponent,
        isHome,
        status: "FINISHED",
        scoreboard: {
          home: hScore,
          away: aScore,
        },
      });
    });
  return matches;
}

export async function syncFlamengoMatches() {
  console.log("Iniciando Sync dos jogos...");
  const l2m = await lastTwoMatches();
  const nm = await nextMatches();
  console.log("Upsert no Supabase...");
  await api.db.upsert([...l2m, ...nm]);
  console.log("Sync dos jogos concluído!");
  console.log("Limpando jogos antigos...");
  await api.db.cleanOldMatches(l2m);
  console.log("Jogos antigos removidos!");
}
