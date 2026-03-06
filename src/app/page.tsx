import { api } from "~/trpc/server";

export default async function Home() {
  const matches = await api.db.matchesCards();
  return matches.map((match) => (
    <h1 key={match.id} className="uppercase">
      {match.is_home ? "Flamengo" : match.opponent}{" "}
      {match.scoreboard?.home ?? ""} - {match.scoreboard?.away ?? ""}{" "}
      {match.is_home ? match.opponent : "Flamengo"}
    </h1>
  ));
}
