export type Match = {
  apiId: string;
  competition: string;
  matchDate: Date;
  opponent: string;
  opponentShield: string;
  isHome: boolean;
  status: string;
  scoreboard: Scoreboard | null;
};

export type Scoreboard = {
  home: number;
  away: number;
  penalties: {
    home: number;
    away: number;
  } | null;
};
