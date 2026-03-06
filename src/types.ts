export type Match = {
  apiId: string;
  competition: string;
  matchDate: Date;
  opponent: string;
  opponentShield: string;
  isHome: boolean;
  status: string;
  scoreboard?: Scoreboard;
};

export type Scoreboard = { home: number; away: number };
