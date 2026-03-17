import { cn, formatDate } from "~/lib/utils";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { Match } from "~/types";
import { WinnerIndicator } from "./winner-indicator";

interface MatchCardProps {
  match: Match;
  variant: "far-left" | "left" | "center" | "right" | "far-right";
}

export function MatchCard({ match, variant }: MatchCardProps) {
  const isCenter = variant === "center";
  const isPast = match.status === "FINISHED";
  const { day, time } = formatDate(match.matchDate);
  const opponentShield = match.opponentShield ?? "/no_shield.png";

  return (
    <div
      className={cn(
        "border-border bg-card relative flex flex-col items-center justify-between rounded-xl border p-4 transition-all duration-300",
        isCenter
          ? "border-flamengo-red/50 z-10 min-h-80 scale-100 shadow-[0_0_30px_rgba(214,40,40,0.15)] lg:min-h-85"
          : "min-h-70 lg:min-h-75",
        variant === "far-left" && "opacity-40",
        variant === "left" && "opacity-70",
        variant === "right" && "opacity-70",
        variant === "far-right" && "opacity-40",
      )}
    >
      {/* Competition badge */}
      <div className="mb-3 w-full text-center">
        <span
          className={cn(
            "text-muted-foreground bg-secondary inline-block rounded-full px-3 py-1 font-semibold tracking-wider uppercase",
            isCenter ? "text-sm" : "text-[10px]",
          )}
        >
          {match.competition}
        </span>
      </div>

      {/* Status label */}
      {isPast && (
        <span className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
          Encerrado
        </span>
      )}
      {isCenter ? (
        <span className="text-flamengo-red mb-2 flex items-center gap-1 text-xs font-semibold tracking-wider uppercase">
          <span className="bg-flamengo-red inline-block h-2 w-2 animate-pulse rounded-full" />
          Próximo jogo
        </span>
      ) : (
        match.status === "SCHEDULED" && (
          <span className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
            Em breve
          </span>
        )
      )}

      {/* Teams */}
      <div
        className={cn(
          "flex w-full flex-1 items-center justify-center",
          isPast ? "gap-3" : "gap-5",
        )}
      >
        {/* Home team */}
        <div className="flex flex-col items-center gap-2">
          <img
            src={match.isHome ? "/flamengo.svg" : opponentShield}
            alt="home logo"
            className={cn(isCenter ? "h-16" : "h-12")}
          />
          <span
            className={cn(
              "text-foreground max-w-20 truncate text-center font-semibold",
              isCenter ? "text-sm" : "text-xs",
            )}
          >
            {match.isHome ? "Flamengo" : match.opponent}
          </span>
        </div>

        {/* Score or VS */}
        <div className="flex flex-col items-center">
          {isPast && match.scoreboard ? (
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <span className="text-foreground text-2xl font-bold">
                  {match.scoreboard.home}
                </span>
                {match.scoreboard.penalties && (
                  <span className="text-foreground text-sm">
                    {match.scoreboard.penalties.home}
                  </span>
                )}
              </div>
              <span className="text-muted-foreground text-lg">x</span>
              <div className="flex flex-col items-center">
                <span className="text-foreground text-2xl font-bold">
                  {match.scoreboard.away}
                </span>
                {match.scoreboard.penalties && (
                  <span className="text-foreground text-sm">
                    {match.scoreboard.penalties.away}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span
              className={cn(
                "text-muted-foreground font-bold",
                isCenter ? "text-2xl" : "text-xl",
              )}
            >
              VS
            </span>
          )}
        </div>

        {/* Away team */}
        <div className="flex flex-col items-center gap-2">
          <img
            src={match.isHome ? opponentShield : "/flamengo.svg"}
            alt="away logo"
            className={cn(isCenter ? "h-16" : "h-12")}
          />
          <span
            className={cn(
              "text-foreground max-w-20 truncate text-center font-semibold",
              isCenter ? "text-sm" : "text-xs",
            )}
          >
            {match.isHome ? match.opponent : "Flamengo"}
          </span>
        </div>
      </div>

      {/* Match info */}
      <div className="mt-3 flex w-full flex-col items-center gap-1.5">
        <div className="text-muted-foreground flex items-center gap-1.5">
          <Calendar className={cn(isCenter ? "h-4 w-4" : "h-3 w-3")} />
          <span className={cn(isCenter ? "text-sm" : "text-xs")}>{day}</span>
        </div>
        {match.location && (
          <div className="text-muted-foreground flex items-center gap-1.5">
            <MapPin className={cn(isCenter ? "h-4 w-4" : "h-3 w-3")} />
            <span className={cn(isCenter ? "text-sm" : "text-xs")}>
              {match.location}
            </span>
          </div>
        )}
        {!isPast && (
          <div className="text-muted-foreground flex items-center gap-1.5">
            <Clock className={cn(isCenter ? "h-4 w-4" : "h-3 w-3")} />
            <span className={cn(isCenter ? "text-sm" : "text-xs")}>{time}</span>
          </div>
        )}
      </div>

      {/* Winner indicator for past games */}
      {isPast && match.scoreboard && (
        <WinnerIndicator scoreboard={match.scoreboard} isHome={match.isHome} />
      )}
    </div>
  );
}
