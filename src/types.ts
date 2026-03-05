export type Match = {
  apiId: string;
  competition: string;
  matchDate: Date;
  opponent: string;
  isHome: boolean;
  status: string;
  scoreboard?: Scoreboard;
};

export type Scoreboard = { home: number; away: number };
