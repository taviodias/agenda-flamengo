import type { Match } from "~/types";
import { MatchCard } from "./match-card";

const variants = ["far-left", "left", "center", "right", "far-right"] as const;

export function MatchesCarousel({ matches }: { matches: Match[] }) {
  return (
    <section className="w-full px-4 py-8">
      {/* Desktop: 5 cards */}
      <div className="mx-auto hidden max-w-6xl items-center justify-center gap-3 lg:flex">
        {matches.map((match, index) => (
          <div
            key={match.apiId}
            className={
              variants[index] === "center" ? "w-70 shrink-0" : "w-55 shrink-0"
            }
          >
            <MatchCard match={match} variant={variants[index]!} />
          </div>
        ))}
      </div>

      {/* Tablet: 3 cards */}
      <div className="mx-auto hidden max-w-2xl items-center justify-center gap-3 md:flex lg:hidden">
        {matches.slice(1, 4).map((match, index) => {
          const tabletVariants = ["left", "center", "right"] as const;
          return (
            <div
              key={match.apiId}
              className={
                tabletVariants[index] === "center"
                  ? "w-65 shrink-0"
                  : "w-60 shrink-0"
              }
            >
              <MatchCard match={match} variant={tabletVariants[index]!} />
            </div>
          );
        })}
      </div>

      {/* Mobile: only next game */}
      <div className="flex justify-center md:hidden">
        <div className="w-full max-w-75">
          <MatchCard match={matches[2]!} variant="center" />
        </div>
      </div>
    </section>
  );
}
