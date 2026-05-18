import { forwardRef } from "react";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const PIECE_GLYPH: Record<string, string> = {
  p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
  P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔",
};

interface Props {
  board: ({ type: string; color: "w" | "b" } | null)[][];
  selected?: string | null;
  legalTargets?: string[];
  lastMove?: { from: string; to: string } | null;
  onSquareClick?: (square: string) => void;
}

export const InteractiveBoard = forwardRef<HTMLDivElement, Props>(function InteractiveBoard(
  { board, selected, legalTargets = [], lastMove, onSquareClick },
  ref,
) {
  return (
    <div
      ref={ref}
      className="inline-block rounded-lg border-4 border-primary/40 bg-background p-3 shadow-2xl shadow-primary/20"
    >
      <div className="grid grid-cols-8">
        {board.map((row, rIdx) =>
          row.map((piece, cIdx) => {
            const file = FILES[cIdx];
            const rank = 8 - rIdx;
            const square = `${file}${rank}`;
            const isLight = (rIdx + cIdx) % 2 === 0;
            const isSelected = selected === square;
            const isTarget = legalTargets.includes(square);
            const isLast = lastMove && (lastMove.from === square || lastMove.to === square);
            const glyph = piece ? PIECE_GLYPH[piece.color === "w" ? piece.type.toUpperCase() : piece.type] : "";

            return (
              <button
                type="button"
                key={square}
                onClick={() => onSquareClick?.(square)}
                className={`relative flex h-12 w-12 items-center justify-center text-3xl transition-colors md:h-16 md:w-16 md:text-4xl ${
                  isLight
                    ? "bg-[oklch(0.86_0.04_150)] text-[oklch(0.18_0.03_155)]"
                    : "bg-[oklch(0.33_0.06_155)] text-[oklch(0.95_0.02_150)]"
                } ${isSelected ? "ring-4 ring-primary ring-inset" : ""} ${
                  isLast ? "ring-2 ring-primary/60 ring-inset" : ""
                }`}
              >
                {glyph}
                {isTarget && (
                  <span
                    className={`pointer-events-none absolute ${
                      piece ? "inset-1 rounded-full ring-4 ring-primary/70" : "h-3 w-3 rounded-full bg-primary/70"
                    }`}
                  />
                )}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
});