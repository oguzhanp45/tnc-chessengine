export type MatchResult = "1-0" | "0-1" | "½-½";

export interface Match {
  id: string;
  white: string;
  black: string;
  result: MatchResult;
  opening: string;
  date: string; // ISO yyyy-mm-dd
  notes?: string;
}

export interface MatchInput {
  white: string;
  black: string;
  result: MatchResult;
  opening: string;
  date: string;
  notes?: string;
}