import * as cheerio from "cheerio";
import type { Match, Scoreboard } from "~/types";

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
  matchDate.setDate(day);
  matchDate.setMonth(month - 1);
  if (matchDate.getMonth() < now.getMonth()) {
    matchDate.setFullYear(now.getFullYear() + 1);
  }
  return matchDate;
}

function parseScoreboard(scores: number[]): Scoreboard {
  const [home, away, penHome, penAway] = scores;
  return {
    home: home ?? 0,
    away: away ?? 0,
    penalties:
      penHome !== undefined && penAway !== undefined
        ? { home: penHome, away: penAway }
        : null,
  };
}

async function getLocationMatch(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    return null;
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const location = $('.match-details p:has(img[src="/images/local.png"])')
    .text()
    .trim();
  if (!location.length) {
    return null;
  }
  const parsedLocation = location.split(/[-(]/)[0]?.trim();
  return parsedLocation ?? null;
}

async function nextMatches() {
  const res = await fetch(PLACAR_FLAMENGO_BASE_URL + "/proximos-jogos");
  if (!res.ok) {
    throw new Error(`Erro ${res.status} no fetch dos próximos jogos.`);
  }
  const matches: Match[] = [];
  const html = await res.text();
  const $ = cheerio.load(html);
  const $matches = $(".match__lg").toArray();
  for (const match of $matches) {
    const $match = $(match);
    const competition = $match.find(".match__lg_card--league").text();
    const [date, time] = $match
      .find(".match__lg_card--datetime")
      .text()
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean) as [string, string];
    const urlMatch = $match.attr("href")!;
    const location = await getLocationMatch(urlMatch);
    const homeTeam = $match.find(".match__lg_card--ht-name").text();
    const awayTeam = $match.find(".match__lg_card--at-name").text();
    const isHome = homeTeam === "Flamengo";
    const opponentShield =
      $match
        .find(`.match__lg_card--${isHome ? "at" : "ht"}-logo img`)
        .attr("src") ?? "";
    const opponent = isHome ? awayTeam : homeTeam;
    const matchDate = parseDate(date, time);
    const apiId = Buffer.from(`${opponent}-${isHome}-${competition}`).toString(
      "base64",
    );
    matches.push({
      apiId,
      competition,
      matchDate,
      opponent,
      opponentShield,
      isHome,
      status: "SCHEDULED",
      scoreboard: null,
      location,
    });
  }
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
  const $matches = $(".match__lg").toArray().slice(0, 2);
  for (const match of $matches) {
    const $match = $(match);
    const urlMatch = $match.attr("href")!;
    const location = await getLocationMatch(urlMatch);
    const scoreBoard = $match.find(".match__lg_card--scoreboard").text().trim();
    const goals = scoreBoard.match(/\d+/g);
    if (!goals || goals.length < 2) {
      throw new Error("Placar não encontrado ou em formato inválido!");
    }
    const scoreboard = parseScoreboard(goals.map(Number));
    const date = $match.find(".match__lg_card--date").text();
    const competition = $match.find(".match__lg_card--league").text();
    const homeTeam = $match.find(".match__lg_card--ht-name").text();
    const awayTeam = $match.find(".match__lg_card--at-name").text();
    const isHome = homeTeam === "Flamengo";
    const opponentShield =
      $match
        .find(`.match__lg_card--${isHome ? "at" : "ht"}-logo img`)
        .attr("src") ?? "";
    const opponent = isHome ? awayTeam : homeTeam;
    const matchDate = parseDate(date);
    const apiId = Buffer.from(`${opponent}-${isHome}-${competition}`).toString(
      "base64",
    );
    matches.push({
      apiId,
      competition,
      matchDate,
      opponent,
      opponentShield,
      isHome,
      status: "FINISHED",
      scoreboard,
      location,
    });
  }
  return matches;
}

export async function extractFlamengoMatches() {
  console.log("Scraping dos jogos...");
  const l2m = await lastTwoMatches();
  const nm = await nextMatches();
  console.log("Scraping concluído.");
  return { l2m, nm };
}
