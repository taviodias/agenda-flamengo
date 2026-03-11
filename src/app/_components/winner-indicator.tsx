import { Trophy } from "lucide-react";
import type { Scoreboard } from "~/types";

export function WinnerIndicator({
  scoreboard,
  isHome,
}: {
  scoreboard: Scoreboard;
  isHome: boolean;
}) {
  const matchResult = defineMatchResult(scoreboard, isHome);
  return (
    <div className="mt-2">
      {matchResult === "Win" && (
        <div className="flex items-center gap-1 text-emerald-500">
          <Trophy className="h-3 w-3" />
          <span className="text-xs font-semibold">Vitória</span>
        </div>
      )}
      {matchResult === "Draw" && (
        <span className="text-xs font-semibold text-amber-500">Empate</span>
      )}
      {matchResult === "Loss" && (
        <span className="text-flamengo-red text-xs font-semibold">Derrota</span>
      )}
    </div>
  );
}

function defineMatchResult(scoreboard: Scoreboard, isHome: boolean) {
  if (scoreboard.home === scoreboard.away) {
    if (!scoreboard.penalties) {
      return "Draw";
    }
    if (isHome) {
      return scoreboard.penalties.home > scoreboard.penalties.away
        ? "Win"
        : "Loss";
    }
    return scoreboard.penalties.home < scoreboard.penalties.away
      ? "Win"
      : "Loss";
  }
  if (isHome) {
    return scoreboard.home > scoreboard.away ? "Win" : "Loss";
  }
  return scoreboard.home < scoreboard.away ? "Win" : "Loss";
}
